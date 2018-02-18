import * as Express from "express";
import { Schema } from "jsonschema";
import { Db } from "mongodb";
import {createController} from "../controllers/controller.factory";
import { CollectionModel } from "../models/collection.model";
import {createRepository} from "../repositories/repository.factory";
import { Service } from "../services/service.model";

const collections: CollectionModel[] = [];

export async function createCollection<T>(name: string, options: ModelOptions): Promise<CollectionModel<T>> {
  let collection: CollectionModel<T> = {
    name,
    schema: options.schema
  };
  if (options.parent) {
    let parentCollection = getCollection(options.parent);
    if (!parentCollection) {
      throw new Error("Unknown parent collection: " + options.parent);
    }
    collection.parent = parentCollection;
  }

  collection.service = new Service(collection);
  await createRepository(collection, options.database);
  createController(options.express, collection);

  collections.push(collection);
  return collection;
}

export function getCollection<T>(name: string): CollectionModel<T> {
  return collections.filter(c => c.name === name)[0] || null;
}

export interface ModelOptions {

  schema?: Schema;
  parent?: string;
  database?: Db;
  express?: Express.Application;

}
