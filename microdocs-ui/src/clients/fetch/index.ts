
import { ProjectClient } from "../project.client";
import { RepoClient } from "../repo.client";
import { ProjectFetchClient } from "./project-fetch.client";
import { RepoFetchClient } from "./repo-fetch.client";
import { DocumentFetchClient } from "./document-fetch.client";
import { DocumentClient } from "../document.client";

// Export classes
export { ProjectClient, RepoClient, DocumentClient };

// Create clients using the fetch api
export const projectClient: ProjectClient = new ProjectFetchClient();
export const repoClient: RepoClient = new RepoFetchClient();
export const documentClient: DocumentClient = new DocumentFetchClient();
