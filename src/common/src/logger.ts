import { context, getCallers } from './utils';

export enum Level {
    ALL,
    DEBUG,
    INFO,
    IMPORTANT,
    WARN,
    ERROR,
    NONE
}

const DEFAULT_NAME = '<Anonymous>';

const SYSTEM_LEVEL = 'process' in context ?
    typeof context['process'].env['LOG_LEVEL'] === 'string' && context['process'].env['LOG_LEVEL'].toUpperCase() in Level ?
        Level[context['process'].env['LOG_LEVEL'].toUpperCase()] : Level.IMPORTANT
    : Level.IMPORTANT;

export class Logger {
    public static readonly SYSTEM_LEVEL = SYSTEM_LEVEL;
    public static readonly DISPLAY_TIME = true;
    private static readonly DEFAULT_NAMESPACE = 'Global';
    private static readonly INSTANCES: Map<string, Logger> = new Map();

    public static getLogger(namespace?: string): Logger {
        if (!namespace) {
            namespace = Logger.DEFAULT_NAMESPACE;
        }
        if (!Logger.INSTANCES.has(namespace)) {
            Logger.INSTANCES.set(namespace, new Logger(namespace));
        }
        return Logger.INSTANCES.get(namespace);
    }

    private constructor(private readonly namespace: string) { }

    private print(printType: 'log' | 'error', priorityPrefix: string | null, message?: any, ...optionalParams: any[]) {
        let prefix = `[${this.namespace}]`;

        if (Logger.DISPLAY_TIME) {
            const NOW = new Date();
            prefix = `[${NOW.toLocaleTimeString()}] ${prefix}`;
        }

        if (priorityPrefix) {
            prefix = `${prefix} [${priorityPrefix}]`;
        }

        if (typeof message === 'string') {
            message = `${prefix} ${message}`;
        } else {
            optionalParams = [message, ...optionalParams];
            message = prefix;
        }

        console[printType].apply(console, [message, ...optionalParams]);
    }

    private printLog(priorityPrefix: string | null, message?: any, ...optionalParams: any[]): void {
        this.print('log', priorityPrefix, message, ...optionalParams);
    }

    private printError(priorityPrefix: string | null, message?: any, ...optionalParams: any[]): void {
        this.print('error', priorityPrefix, message, ...optionalParams);
    }

    public info(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.INFO) {
            this.printLog('INFO', message, ...optionalParams);
        }
    }

    public debug(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.DEBUG) {
            const callers = getCallers();
            this.printLog(`DEBUG] [${callers && callers[1] || DEFAULT_NAME}`, message, ...optionalParams);
        }
    }

    public log(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.INFO) {
            this.printLog(null, message, ...optionalParams);
        }
    }

    public warn(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.WARN) {
            const callers = getCallers();
            this.printError(`WARN] [${callers && callers[1] || DEFAULT_NAME}`, message, ...optionalParams);
        }
    }

    public error(message?: any, ...optionalParams: any[]): void {
        if (SYSTEM_LEVEL <= Level.ERROR) {
            const callers = getCallers();
            this.printError(`ERROR] [${callers && callers[1] || DEFAULT_NAME}`, message, ...optionalParams);
        }
    }
}

export namespace Logger {
    enum Level {
        ALL,
        DEBUG,
        INFO,
        IMPORTANT,
        WARN,
        ERROR,
        NONE
    }
}

Logger.getLogger().log('Current platform: %s', 'process' in context ? context['process'].platform : 'browser');
