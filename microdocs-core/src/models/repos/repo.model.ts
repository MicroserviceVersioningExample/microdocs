export interface Repo {

  _id: string;
  name?: string;
  projectId: string;
  type: RepoType;
  externalUrl?: string;
  latestTag?: string;

}

export enum RepoType {

  Static = "static",
  Sync = "sync"

}
