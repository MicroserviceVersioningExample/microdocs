import {
  Document, DocumentSchema,
  Project, ProjectSchema,
  Repo, RepoSchema,
  Tag, TagSanitizer, TagSchema
} from "@maxxton/microdocs-core";
import * as bodyParser from "body-parser";
import * as express from "express";
import {MongoClient} from "mongodb";
import * as winston from "winston";
import {ErrorMiddleware} from "./middlewares/error.middleware";
import {createCollection} from "./models/model.factory";

(async () => {
  winston.configure({
    level: "silly",
    transports: [
      new (winston.transports.Console)()
    ]
  });
  
  let app = express();
  app.use(bodyParser.json());
  
  let url = process.env.MONGO_URL || "mongodb://localhost:27017";
  let mongoClient = await MongoClient.connect(url);
  let database = mongoClient.db("microdocs");
  
  let projectsCollection = await createCollection<Project>("projects", {
    schema: ProjectSchema, express: app, database
  });
  
  let reposCollection = await createCollection<Repo>("repos", {
    schema: RepoSchema, parent: "projects", express: app, database
  });
  
  app.use((req, res, next) => {
    try {
      let error: any = new Error("Not Found");
      error.status = 404;
      throw error;
    } catch (e) {
      next(e);
    }
  });
  app.use(ErrorMiddleware);
  
  winston.info("listening on 3000");
  app.listen(3000);
})().then().catch(e => {
  winston.error(e);
});

// let reposCollection = modelFactory.createCollection<Repo>("repos", {
//   schema: RepoSchema,
//   parentModel: "projects"
// });
//
// let tagsCollection = modelFactory.createCollection<Tag>("tags", {
//   schema: TagSchema,
//   parentModel: "repos",
//   sanitizer: TagSanitizer as any,
//   postUpdateHook: async (tag) => {
//     let repo = await reposCollection.get(tag.repoId);
//     repo.latestTag = tag._id;
//     await reposCollection.put(repo);
//   }
// });
//
// let documentsCollection = modelFactory.createCollection<Document>("documents", {
//   schema: DocumentSchema,
//   parentModel: "repos"
// });
//
// app.use("/db", ExpressPouchDB(PouchDB, {
//   mode: "minimumForPouchDB"
// }));
//
// generateApiRoutes(app, modelFactory);
//
