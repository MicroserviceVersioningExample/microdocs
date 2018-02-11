import { Schema } from "jsonschema";
import * as schema from "./document.schema.json";
import * as apiSchema from "./open-api/open-api-v3.0.json";

let merged = merge(apiSchema, schema);

// tslint:disable-next-line
export const DocumentSchema: Schema = merged as Schema;
export * from "./document.model";

function merge(o1, o2): any {
  Object.keys(o2).forEach(key => {
    let value = o2[key];
    if (typeof(value) === "object") {
      value = merge(o1[key], value);
    }
    o1[key] = value;
  });
  return o1;
}
