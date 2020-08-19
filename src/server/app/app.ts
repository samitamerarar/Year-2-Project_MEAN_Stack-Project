/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as cors from 'cors';
import * as PacketAPI from '../../common/src/communication/packet-api';
import { PacketManagerServer } from './packet-manager';

import { WordConstraint } from '../../common/src/lexic/word-constraint';

import { registerMiddleWares } from './routes/middle-ware';
import './routes';
import '../../common/src/lexic/word-packet';
import { Logger } from '../../common/src';

@PacketAPI.PacketHandlerClass()
export class Application {

    public static readonly SECRET = '<Put random string here>';
    public static readonly logger: Logger = Logger.getLogger('App');

    public app: express.Application;
    public packetManager: PacketManagerServer;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    public static bootstrap(): Application {
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // Application instantiation
        this.app = express();

        // Packet Manager instanciation
        this.packetManager = PacketManagerServer.getInstance();

        // configure this.application
        this.config();

        // configure routes
        this.routes();
    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev', { skip: (req, res) => !/\/lexic\/words/i.test(req.baseUrl) }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser(Application.SECRET));
        this.app.use(session({ secret: Application.SECRET, resave: false, saveUninitialized: false }));
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors({ credentials: true, preflightContinue: true }));
    }

    @PacketAPI.PacketHandler(WordConstraint)
    public wordConstraintHandler(event: PacketAPI.PacketEvent<WordConstraint>): void {
        Application.logger.debug('TEST Handler', event.value);
        this.packetManager.sendPacket(WordConstraint, event.value, event.socketid);
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes() {
        let router: express.Router;
        router = express.Router();

        // create routes
        registerMiddleWares(router);

        // use router middleware
        this.app.use(router);

        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
