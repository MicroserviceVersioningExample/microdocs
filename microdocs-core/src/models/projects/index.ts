import { Schema } from "jsonschema";
import * as schema from "./project.schema.json";

// tslint:disable-next-line
export const ProjectSchema: Schema = schema as Schema;
export * from "./project.model";
