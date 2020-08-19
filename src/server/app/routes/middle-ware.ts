import * as express from 'express';
import { Logger, Class, Constructor } from '../../../common/src';

type RequestHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => void;
export type RouteType = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options' | 'all' | 'use';


interface RouteEntry {
    type: RouteType | RouteType[];
    value: string;
    handler: RequestHandler;
    handlerName: string;
}

const logger = Logger.getLogger('Router');

const DEFAULT_NAME = '<Annonymous>';
const REGISTER_FUNCTION = Symbol('registerFunction');
const MIDDLEWARES: Map<Constructor, string[]> = new Map();
const ROUTE_ENTRIES: Map<Class, RouteEntry[]> = new Map();

// Decorator
export function MiddleWare<T extends Class>(constructor: T, ...handlers: express.RequestHandler[]): void;
// Decorator Factory
export function MiddleWare(baseRoute: string, ...handlers: express.RequestHandler[]): ClassDecorator;
export function MiddleWare<T extends Class>(baseRoute: string | T, ...handlers: express.RequestHandler[]): ClassDecorator | void {
    const MIDDLEWARE_DECORATOR = (constructor: Class): void => {
        constructor.prototype[REGISTER_FUNCTION] = (router: express.Router): void => {
            if (handlers.length > 0) {
                router.use(...handlers);
            }
            const routes: RouteEntry[] = ROUTE_ENTRIES.get(constructor) || [];
            baseRoute = (typeof baseRoute === 'string' ? baseRoute : '');
            for (const route of routes) {
                const ROUTING_ARGUMENTS: any[] = [];
                if (route.value) {
                    ROUTING_ARGUMENTS.push((route.value || ''));
                }
                ROUTING_ARGUMENTS.push(route.handler);
                if (Array.isArray(route.type)) {
                    for (const type of route.type) {
                        router[type].apply(router, ROUTING_ARGUMENTS);
                    }
                }
                else {
                    router[route.type].apply(router, ROUTING_ARGUMENTS);
                }
                const DISPLAYABLE_TYPE = Array.isArray(route.type) ?
                    route.type.map((type) => type.toUpperCase()) :
                    route.type.toUpperCase();
                logger.info('%sRouted %s requests at "%s" to %s',
                    baseRoute ? '\t' : '',
                    route.value ? DISPLAYABLE_TYPE : 'all',
                    route.value || '/',
                    (constructor.name || DEFAULT_NAME) + '.' + (route.handlerName || DEFAULT_NAME));
            }
        };
        if (!MIDDLEWARES.has(constructor as Constructor)) {
            MIDDLEWARES.set(constructor as Constructor, []);
        }
        MIDDLEWARES.get(constructor as Constructor).push(typeof baseRoute === 'string' && baseRoute || null);
    };
    if (typeof baseRoute === 'string') {
        return MIDDLEWARE_DECORATOR as ClassDecorator;
    } else {
        MIDDLEWARE_DECORATOR(baseRoute);
    }
}

// Decorator factory
export function Route(type: RouteType | RouteType[], route: string): MethodDecorator;
export function Route(type: 'use'): MethodDecorator;
export function Route(type: RouteType | RouteType[], route?: string): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
        const ORIGINAL_FUNCTION = descriptor.value;
        descriptor.value = function (req: express.Request, res: express.Response, next?: express.NextFunction): any {
            logger.debug('Handling %s request to "%s" (%s)',
                req.method,
                req.url,
                ORIGINAL_FUNCTION.name || DEFAULT_NAME);
            return ORIGINAL_FUNCTION.call(this, req, res, next);
        };

        if (!ROUTE_ENTRIES.has(target.constructor)) {
            ROUTE_ENTRIES.set(target.constructor, []);
        }
        const ENTRY: RouteEntry = {
            type: type,
            value: route,
            handler: descriptor.value,
            handlerName: ORIGINAL_FUNCTION.name
        };
        ROUTE_ENTRIES.get(target.constructor).push(ENTRY);
    };
}

export function registerMiddleWares(router: express.Router) {
    let middlewareRouter: express.Router;
    for (const [constructor, baseRoutes] of MIDDLEWARES) {
        for (const baseRoute of baseRoutes) {
            middlewareRouter = router;

            if (baseRoute) {
                middlewareRouter = express.Router();
                router.use(baseRoute, middlewareRouter);
                logger.info('Registering sub-routes of "%s" (%s)',
                    baseRoute,
                    constructor.name || DEFAULT_NAME);
            }
            (new constructor)[REGISTER_FUNCTION](middlewareRouter);
        }
    }
}
