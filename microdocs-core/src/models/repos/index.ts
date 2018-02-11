import { Schema } from "jsonschema";
import * as schema from "./repo.schema.json";

// tslint:disable-next-line
export const RepoSchema: Schema = schema as Schema;
export * from "./repo.model";
