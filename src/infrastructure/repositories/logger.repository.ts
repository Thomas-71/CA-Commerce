import * as Ports from '../../business/ports';

export class Logger implements Ports.Logger {
    debug(message: string): void {
        console.debug(message);
    }

    info(message: string): void {
        console.info(message);
    }

    warn(message: string): void {
        console.warn(message);
    }

    error(message: string): void {
        console.error(message);
    }
}