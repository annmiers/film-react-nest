import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
    private escapeValue(value: string): string {
        return value.replace(/\t/g, '\\t').replace(/\n/g, '\\n');
    }

    private formatMessage(level: string, message: any, ...optionalParams: any[]) {
        const fields: string[] = [];

        fields.push(`timestamp=${this.escapeValue(new Date().toISOString())}`);
        fields.push(`level=${this.escapeValue(level)}`);

        const msgStr = typeof message === 'object' ? JSON.stringify(message) : String(message);
        fields.push(`message=${this.escapeValue(msgStr)}`);

        optionalParams.forEach((param, i) => {
        const paramStr = typeof param === 'object' ? JSON.stringify(param) : String(param);
        fields.push(`param${i}=${this.escapeValue(paramStr)}`);
        });

        return fields.join('\t') + '\n';
    }

    log(message: any, ...optionalParams: any[]) {
        process.stdout.write(this.formatMessage('log', message, optionalParams));
    }

    error(message: any, ...optionalParams: any[]) {
        process.stderr.write(this.formatMessage('error', message, optionalParams));
    }

    warn(message: any, ...optionalParams: any[]) {
        process.stdout.write(this.formatMessage('warn', message, optionalParams));
    }

    debug?(message: any, ...optionalParams: any[]) {
        process.stdout.write(this.formatMessage('debug', message, optionalParams));
    }

    verbose?(message: any, ...optionalParams: any[]) {
        process.stdout.write(this.formatMessage('verbose', message, optionalParams));
    }
}