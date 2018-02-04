
import { DocumentClient } from "../document.client";
import { ProjectClient } from "../project.client";
import { RepoClient } from "../repo.client";
import { UserClient } from "../user.client";
import { DocumentFetchClient } from "./document-fetch.client";
import { ProjectFetchClient } from "./project-fetch.client";
import { RepoFetchClient } from "./repo-fetch.client";
import { UserFetchClient } from "./user-fetch.client";

// Export classes
export { ProjectClient, RepoClient, DocumentClient, UserClient };

// Create clients using the fetch api
export const projectClient: ProjectClient = new ProjectFetchClient();
export const repoClient: RepoClient = new RepoFetchClient();
export const documentClient: DocumentClient = new DocumentFetchClient();
export const userClient: UserClient = new UserFetchClient();
