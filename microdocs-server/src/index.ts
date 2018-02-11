import {
  Document, DocumentSchema,
  ModelFactory,
  Project, ProjectSchema,
  Repo, RepoSchema,
  Tag, TagSanitizer, TagSchema } from "@maxxton/microdocs-core";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as ExpressPouchDB from "express-pouchdb";
import * as PouchDB from "pouchdb";
import * as HttpAdapter from "pouchdb-adapter-http";
import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as PourchDBFind from "pouchdb-find";
import * as winston from "winston";
import { generateApiRoutes } from "./api.factory";

PouchDB.plugin(HttpAdapter);
PouchDB.plugin(MemoryAdapter);
PouchDB.plugin(PourchDBFind);

let app = express();
app.use(bodyParser.json());

let httpDB = PouchDB.defaults({ adapter: "http" });

const modelFactory = new ModelFactory(httpDB, {
  remoteURL: "http://localhost:5984"
});

let projectsCollection = modelFactory.createCollection<Project>("projects", {
  schema: ProjectSchema
});

let reposCollection = modelFactory.createCollection<Repo>("repos", {
  schema: RepoSchema,
  parentModel: "projects"
});

let tagsCollection = modelFactory.createCollection<Tag>("tags", {
  schema: TagSchema,
  parentModel: "repos",
  sanitizer: TagSanitizer as any,
  postUpdateHook: async (tag) => {
    let repo = await reposCollection.get(tag.repoId);
    repo.latestTag = tag._id;
    await reposCollection.put(repo);
  }
});

let documentsCollection = modelFactory.createCollection<Document>("documents", {
  schema: DocumentSchema,
  parentModel: "repos"
});

app.use("/db", ExpressPouchDB(PouchDB, {
  mode: "minimumForPouchDB"
}));

generateApiRoutes(app, modelFactory);

winston.info("listening on 3000");
app.listen(3000);
