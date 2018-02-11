import { ExternalDocs } from "../../external-doc/external-doc.model";
import { Ref } from "../../ref.model";
import { Discriminator } from "./discriminator.model";
import { Type } from "./types.model";

export interface Schema extends Ref {

  title?: string;
  description?: string;
  type?: Type;
  format?: string;

  default?: any;
  example?: any;
  deprecated?: boolean;
  externalDocs?: ExternalDocs;

  // Structure
  properties?: { [propertyName: string]: Schema };
  items?: Schema;
  additionalProperties?: boolean;
  enum?: string[];

  // Inherit
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  not?: Schema[];

  // Validation
  optional?: boolean;
  required?: boolean;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?; number;
  uniqueItems?; boolean;
  maxProperties?: number;
  minProperties?: number;
  nullable?: boolean;

  discriminator?: Discriminator;
  readonly?: boolean;
  writeOnly?: boolean;

}
