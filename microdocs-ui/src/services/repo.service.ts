
import { ReplaySubject } from "rxjs/ReplaySubject";
import { RepoClient } from "../clients/repo.client";
import { Project } from "../domain/project.model";
import { Repo } from "../domain/repo.model";
import { LoggerService } from "./logger.service";
import { ProjectService } from "./project.service";
import { RouterService } from "./router.service";
import { Observable } from "rxjs/Observable";

export class RepoService {

  private reposStream = new ReplaySubject<Repo[]>();
  private selectedProject: Project;

  constructor(private repoClient: RepoClient,
              private loggerService: LoggerService,
              private routerService: RouterService,
              private projectService: ProjectService) {
    projectService.selectedProject.subscribe(selectedProject => {
      this.selectedProject = selectedProject;
      this.refreshRepos();
    });
  }

  public get repos(): Observable<Repo[]> {
    return this.reposStream;
  }

  public refreshRepos(): void {
    if(this.selectedProject) {
      this.repoClient.getRepos( this.selectedProject )
          .then( repos => this.reposStream.next( repos ) )
          .catch( e => this.loggerService.error( "Failed to load repositories", e ) );
    }
  }

}
