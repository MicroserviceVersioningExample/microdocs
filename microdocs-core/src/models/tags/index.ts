import { Schema } from "jsonschema";
import * as schema from "./tag.schema.json";

// tslint:disable-next-line
export const TagSchema: Schema = schema as Schema;
export * from "./tag.model";
export * from "./tag.sanitizer";
