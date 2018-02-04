import { documentClient, projectClient, repoClient, userClient } from "../clients/fetch/index";
import { DocumentService } from "./document.service";
import { LoggerService } from "./logger.service";
import { ProjectService } from "./project.service";
import { RepoService } from "./repo.service";
import { RouterService } from "./router.service";
import { UserService } from "./user.service";

// Export classes
export { RouterService, LoggerService, ProjectService, RepoService, DocumentService, UserService };

// Create services
export const routerService = new RouterService();
export const loggerService = new LoggerService();
export const projectService = new ProjectService(projectClient, loggerService, routerService);
export const repoService = new RepoService(repoClient, loggerService, routerService, projectService);
export const documentService = new DocumentService(documentClient, loggerService, routerService, projectService,
  repoService);
export const userService = new UserService(loggerService, userClient);
