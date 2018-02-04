
import { Container } from "typedi";
import { ProjectJsonRepository } from "../repositories/json/project-json.repo";
import { storage, web } from "./property-keys";
import { Settings } from "./settings";
import { RepoJsonRepository } from "../repositories/json/repo-json.repo";
import { DocumentJsonRepository } from "../repositories/json/document-json.repo";
import { ClientRepository } from "../repositories/auth/client.repo";
import { TokenJsonRepository } from "../repositories/auth/json/token-json.repo";
import { RefreshTokenJsonRepository } from "../repositories/auth/json/refresh-token-json.repo";
import { AuthorizationCodeJsonRepository } from "../repositories/auth/json/authorization-code-json.repo";
import { UserJsonRepository } from "../repositories/json/user-json.repo";
import { GroupJsonRepository } from "../repositories/json/group-json.repo";

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
    Container.set("document.repo", new DocumentJsonRepository());
    Container.set("user.repo", new UserJsonRepository());
    Container.set("group.repo", new GroupJsonRepository());
    Container.set("client.repo", new ClientRepository());
    Container.set("token.repo", new TokenJsonRepository());
    Container.set("refresh-token.repo", new RefreshTokenJsonRepository());
    Container.set("authorization-code.repo", new AuthorizationCodeJsonRepository());
  }

}
