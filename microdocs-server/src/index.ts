import "reflect-metadata";
import { Container } from "typedi";
import { StorageConfig } from "./config/storage.config";
import { WebConfig } from "./config/web.config";

let storageConfig = Container.get(StorageConfig);
let webConfig = Container.get(WebConfig);

storageConfig.init();
webConfig.init();
