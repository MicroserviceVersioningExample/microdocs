import { CollectionModel } from "../models/collection.model";

/**
 * Get Rest Path for a collection
 * @param {string} basePath
 * @param {CollectionModel} collection
 * @returns {string}
 */
export function getPath(basePath: string, collection: CollectionModel): string {
  if (collection.parent) {
    let parentPath = getPath(basePath, collection.parent);
    let idName = collection.parent.name.substring(0, collection.parent.name.length - 1) + "Id";
    return `${parentPath}/:${idName}/${collection.name}`;
  } else {
    return `${basePath}/${collection.name}`;
  }
}

/**
 * Get index fields of a collection
 * @param {Collection} collection
 * @returns {string[]}
 */
export function getIndexFields(collection: CollectionModel): string[] {
  if (collection.parent) {
    let fields = this.getIndexFields(collection.parent);
    let idName = collection.parent.name.substring(0, collection.parent.name.length - 1) + "Id";
    fields.push(idName);
    return fields;
  } else {
    return [];
  }
}
