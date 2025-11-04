import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
    private serializeValue(value: any): any {
        if (value === undefined || value === null) {
        return null;
        }
        if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
        }
        return value;
    }

    private formatMessage(level: string, message: any, ...optionalParams: any[]) {
        return {
        timestamp: new Date().toISOString(),
        level,
        message: this.serializeValue(message),
        optionalParams: optionalParams.map(p => this.serializeValue(p)),
        };
    }

    log(message: any, ...optionalParams: any[]) {
        console.log(JSON.stringify(this.formatMessage('log', message, ...optionalParams)));
    }

    error(message: any, ...optionalParams: any[]) {
        console.error(JSON.stringify(this.formatMessage('error', message, ...optionalParams)));
    }

    warn(message: any, ...optionalParams: any[]) {
        console.warn(JSON.stringify(this.formatMessage('warn', message, ...optionalParams)));
    }

    debug?(message: any, ...optionalParams: any[]) {
        console.debug(JSON.stringify(this.formatMessage('debug', message, ...optionalParams)));
    }

    verbose?(message: any, ...optionalParams: any[]) {
        console.log(JSON.stringify(this.formatMessage('verbose', message, ...optionalParams)));
    }
}