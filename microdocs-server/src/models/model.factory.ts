import * as Express from "express";
import { Schema } from "jsonschema";
import { Db } from "mongodb";
import { CollectionModel } from "../models/collection.model";
import { Service } from "../services/service.model";
import { createController } from "./api.factory";
import { createRepository } from "./repository.factory";

const collections: CollectionModel[] = [];

export async function createCollection<T>(name: string, options: ModelOptions): Promise<CollectionModel<T>> {
  let collection: CollectionModel<T> = {
    name
  };
  if (parent) {
    let parentCollection = getCollection(name);
    if (!parentCollection) {
      throw new Error("Unknown parent collection: " + parent);
    }
    collection.parent = parentCollection;
  }

  collection.service = new Service(collection);
  await createRepository(collection, options.database);
  createController(options.express, collection);

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
