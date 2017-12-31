
import { Container } from "typedi";
import { ProjectJsonRepository } from "../repositories/json/project-json.repo";
import { storage, web } from "./property-keys";
import { Settings } from "./settings";
import { RepoJsonRepository } from "../repositories/json/repo-json.repo";

/**
 * Configure the Storage Drivers
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class StorageConfig {

  public init(): void {
    let driver = Settings.get(storage.driver, "json");
    switch (driver.toLowerCase()) {

      case "json":
        this.configureJson();
        break;

      default:
        throw new Error("Unknown storage driver: " + driver);

    }
  }

  private configureJson(): void {
    Container.set("project.repo", new ProjectJsonRepository());
    Container.set("repo.repo", new RepoJsonRepository());
  }

}
