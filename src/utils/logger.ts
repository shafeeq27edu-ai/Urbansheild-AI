type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private log(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        // In a real app, we might send this to an external service. 
        // For now, console output is sufficient for debugging.
        if (data) {
            console[level](formattedMessage, data);
        } else {
            console[level](formattedMessage);
        }
    }

    info(message: string, data?: any) { this.log('info', message, data); }
    warn(message: string, data?: any) { this.log('warn', message, data); }
    error(message: string, data?: any) { this.log('error', message, data); }
    debug(message: string, data?: any) { this.log('debug', message, data); }
}

export const logger = new Logger();
