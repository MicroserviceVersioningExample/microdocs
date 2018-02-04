import { User } from "./domain/user.model";

/**
 * Session context
 * directly persisted into the localstorage
 */
export class Context {

  public static get userId(): string {
    let context = Context.context;
    return context.userId;
  }

  public static set userId(userId: string) {
    let context = Context.context;
    context.userId = userId;
    Context.context = context;
  }

  public static get token(): string {
    let context = Context.context;
    return context.token;
  }

  public static set token(token: string) {
    let context = Context.context;
    context.token = token;
    Context.context = context;
  }

  public static get refreshToken(): string {
    let context = Context.context;
    return context.refreshToken;
  }

  public static set refreshToken(refreshToken: string) {
    let context = Context.context;
    context.refreshToken = refreshToken;
    Context.context = context;
  }

  public static get context(): ContextOptions {
    try {
      let contextString = localStorage.getItem("context");
      return JSON.parse(contextString) as ContextOptions;
    } catch (e) {
      // do nothing
    }
    return {};
  }

  public static set context(context: ContextOptions) {
    try {
      localStorage.setItem("context", JSON.stringify(context));
    } catch (e) {
      // do nothing
    }
  }

}

export interface ContextOptions {

  userId?: string;
  token?: string;
  refreshToken?: string;

}
