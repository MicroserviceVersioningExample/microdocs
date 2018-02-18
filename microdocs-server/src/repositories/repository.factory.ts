import {Db} from "mongodb";
import {getIndexFields} from "../helpers/model.helper";
import {CollectionModel} from "../models/collection.model";

export async function createRepository(model: CollectionModel, db: Db): Promise<CollectionModel> {
  
  let collection = db.collection(model.name);
  model.db = collection;
  
  let indexFields = getIndexFields(model);
  
  if (indexFields.length > 0) {
    await collection.createIndex({"_id.id": 1});
    await Promise.all(indexFields.map(field => {
      let fields: any = {};
      fields["_id." + field] = 1;
      return collection.createIndex(fields);
    }));
  }
  
  return model;
}
