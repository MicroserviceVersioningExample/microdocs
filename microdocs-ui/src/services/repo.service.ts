import {Location} from "history";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {RepoClient} from "../clients/repo.client";
import {Project} from "../domain/project.model";
import {RepoTypes} from "../domain/repo-types.model";
import {Repo} from "../domain/repo.model";
import {LoggerService} from "./logger.service";
import {ProjectService} from "./project.service";
import {RouterService} from "./router.service";

export class RepoService {
  
  private reposStream = new BehaviorSubject<Repo[]>([]);
  private selectedRepoStream = new BehaviorSubject<Repo>(null);
  private loadedProject: Project;
  private selectedProject: Project;
  
  constructor(private repoClient: RepoClient,
              private loggerService: LoggerService,
              private routerService: RouterService,
              private projectService: ProjectService) {
    projectService.selectedProject.subscribe(selectedProject => {
      if (this.selectedProject !== selectedProject) {
        this.selectedProject = selectedProject;
        this.refreshRepos();
      }
    });
    
    Observable.combineLatest(this.repos, routerService.location).subscribe(r => {
      if (this.loadedProject === this.selectedProject) {
        let repos: Repo[] = r[0];
        let location: Location = r[1];
        
        let params = this.routerService.parsePath(location, "/api-docs/:project/repos/:repo/*");
        if (params && params["repo"]) {
          let selectedRepo = repos.filter(repo => repo.id.toLowerCase() === params["repo"])[0];
          if (!selectedRepo) {
            loggerService.error(`Repo '${params["repo"]}' doesn't exists`);
            routerService.history.push(`/api-docs/${params["project"]}/overview`);
            if (this.selectedRepoStream.value !== null) {
              this.selectedRepoStream.next(null);
            }
          } else {
            if (this.selectedRepoStream.value !== selectedRepo) {
              this.selectedRepoStream.next(selectedRepo);
            }
            
          }
        } else {
          if (this.selectedRepoStream.value !== null) {
            this.selectedRepoStream.next(null);
          }
        }
      }
    }, e => this.loggerService.error(e));
  }
  
  public get repos(): Observable<Repo[]> {
    return this.reposStream;
  }
  
  public get selectedRepo(): Observable<Repo> {
    return this.selectedRepoStream;
  }
  
  public refreshRepos(): void {
    let project = this.selectedProject;
    if (project) {
      this.repoClient.getRepos(project)
        .then(repos => {
          this.loadedProject = project;
          this.reposStream.next(repos);
        })
        .catch(e => this.loggerService.error("Failed to load repositories", e));
    }
  }
  
  /**
   * Create Repository which synces from an external url
   * @param {Project} project
   * @param {string} name
   * @param {string} externalUrl
   * @return {Promise<Repo>}
   */
  public async createSyncRepo(project: Project, name: string, externalUrl: string): Promise<Repo> {
    let repo: Repo = {
      id: name.replace(/\s/gi, "-").replace(/[^\w\d-]/gi, "").toLowerCase(),
      name,
      type: RepoTypes.Sync,
      externalUrl
    };
    let newRepo = await this.repoClient.createRepo(project, repo);
    let repos = this.reposStream.getValue();
    repos.push(newRepo);
    this.reposStream.next(repos);
    return newRepo;
  }
  
  /**
   * Create Repository
   * @param {Project} project
   * @param {string} name
   * @return {Promise<Repo>}
   */
  public async createRepo(project: Project, name: string): Promise<Repo> {
    let repo: Repo = {
      id: name.replace(/\s/gi, "-").replace(/[^\w\d-]/gi, "").toLowerCase(),
      name,
      type: RepoTypes.Static
    };
    let newRepo = await this.repoClient.createRepo(project, repo);
    let repos = this.reposStream.getValue();
    repos.push(newRepo);
    this.reposStream.next(repos);
    return newRepo;
  }
  
  /**
   * Delete Repository
   * @param {Project} project
   * @param {string} repoId
   * @return {Promise<void>}
   */
  public async deleteRepo(project: Project, repoId: string): Promise<void> {
    await this.repoClient.deleteRepo(project, repoId);
    let repos = this.reposStream.getValue();
    let index = repos.findIndex(repo => repo.id === repoId);
    if (index > -1) {
      repos.splice(index, 1);
      this.reposStream.next(repos);
    }
  }
  
}
