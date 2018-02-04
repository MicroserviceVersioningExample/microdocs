/**
 * Logger Service
 */
export class LoggerService {
  
  public error(message: string, e?: Error): void {
    // tslint:disable-next-line
    console.error(message, e);
  }
  
  public info(message: string): void {
    // tslint:disable-next-line
    console.info(message);
  }

}
