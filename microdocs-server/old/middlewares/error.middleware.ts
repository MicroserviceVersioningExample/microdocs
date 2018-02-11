import { Request, Response } from "express";
import { Action, ExpressErrorMiddlewareInterface, Middleware } from "routing-controllers";
import * as logger from "winston";
import { ValidationException } from "../domain/common/validation.error";

@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {

  public error(error: any, request: Request, response: Response, next: (err?: any) => any) {
    let body: any = {
      message: error.message,
      path: request.path
    };
    if (error instanceof ValidationException || error.validationError) {
      body.status = 400;
      body.errors = (error as ValidationException).errors;
    }
    body.status = error.httpCode || body.status || 500;
    let errorMessage = "Error";
    switch (body.status) {
      case 400:
        errorMessage = "Bad Request";
        break;
      case 401:
        errorMessage = "Unauthorized";
        break;
      case 403:
        errorMessage = "Forbidden";
        break;
      case 404:
        errorMessage = "Not Found";
        break;
      case 500:
        errorMessage = "Internal Server Error";
        if (error.stack) {
          logger.error(error.stack);
        }
        break;
    }
    if (errorMessage) {
      body.error = errorMessage;
    }
    if (logger.level === "debug") {
      let stack = error.stack;
      if (stack) {
        body.stack = stack.split("\n");
      }
    }

    body.status = body.status || 500;
    response.status(body.status || 500).send(body);
    next();
  }

}
