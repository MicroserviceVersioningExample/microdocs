import { projectClient, repoClient } from "../clients/fetch/index";
import { LoggerService } from "./logger.service";
import { ProjectService } from "./project.service";
import { RepoService } from "./repo.service";
import { RouterService } from "./router.service";

// Export classes
export { RouterService, LoggerService, ProjectService, RepoService };

// Create services
export const routerService = new RouterService();
export const loggerService = new LoggerService();
export const projectService = new ProjectService(projectClient, loggerService, routerService);
export const repoService = new RepoService(repoClient, loggerService, routerService, projectService);
