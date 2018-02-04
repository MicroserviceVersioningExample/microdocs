import { Config } from "./config";

export class DevConfig implements Config {

  public readonly baseUrl: string = "http://localhost:8000";
  public readonly clientId: string = "microdocs";
  public readonly clientSecret: string = "microdocs";

}
