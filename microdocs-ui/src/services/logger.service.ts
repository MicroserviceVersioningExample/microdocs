/**
 * Logger Service
 */
export class LoggerService {

  public error(message: string, e?: Error): void {
    console.error(message, e);
  }

}
