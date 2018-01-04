import { Location } from "history";
import "rxjs/add/observable/combineLatest";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { ProjectClient } from "../clients/project.client";
import { Project } from "../domain/project.model";
import { LoggerService } from "./logger.service";
import { RouterService } from "./router.service";

/**
 * Project Service
 */
export class ProjectService {

  private projectStream = new ReplaySubject<Project[]>();
  private selectedProjectStream = new ReplaySubject<Project>();

  constructor(private projectClient: ProjectClient,
              private loggerService: LoggerService,
              private routerService: RouterService) {
    this.refreshProjects();

    Observable.combineLatest(this.projects, routerService.location).subscribe(r => {
      let projects: Project[] = r[0];
      let location: Location = r[1];

      let params = this.routerService.parsePath(location, "/api-docs/:project/*");
      if (params && params["project"]) {
        let selectedProject = projects.filter(project => project.name.toLowerCase() === params["project"])[0];
        if (!selectedProject) {
          loggerService.error(`Project '${params["project"]}' doesn't exists`);
          routerService.history.push("/api-docs");
        }
        this.selectedProjectStream.next(selectedProject || null);
      } else {
        this.selectedProjectStream.next(null);
      }
    }, e => this.loggerService.error(e));
  }

  public get projects(): Observable<Project[]> {
    return this.projectStream;
  }

  public refreshProjects() {
    this.projectClient.getProjects()
      .then(projects => this.projectStream.next(projects))
      .catch(e => this.loggerService.error("Failed to load projects", e));
  }

  public get selectedProject(): Observable<Project> {
    return this.selectedProjectStream;
  }

  public setSelectedProject(project: Project): void {
    this.selectedProjectStream.next(project);
  }

}
