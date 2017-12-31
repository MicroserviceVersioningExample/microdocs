
import { ProjectClient } from "../project.client";
import { RepoClient } from "../repo.client";
import { ProjectFetchClient } from "./project-fetch.client";
import { RepoFetchClient } from "./repo-fetch.client";

// Export classes
export { ProjectClient, RepoClient };

// Create clients using the fetch api
export const projectClient: ProjectClient = new ProjectFetchClient();
export const repoClient: RepoClient = new RepoFetchClient();
