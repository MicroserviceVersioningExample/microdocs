import { Location } from "history";
import "rxjs/add/observable/combineLatest";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { ProjectClient } from "../clients/project.client";
import { Project } from "../domain/project.model";
import { LoggerService } from "./logger.service";
import { RouterService } from "./router.service";

/**
 * Project Service
 */
export class ProjectService {

  private projectStream = new BehaviorSubject<Project[]>([]);
  private selectedProjectStream = new BehaviorSubject<Project>(null);

  constructor(private projectClient: ProjectClient,
              private loggerService: LoggerService,
              private routerService: RouterService) {
    this.refreshProjects();

    Observable.combineLatest(this.projects, routerService.location).subscribe(r => {
      let projects: Project[] = r[0];
      let location: Location = r[1];

      let params = this.routerService.parsePath(location, "/api-docs/:project/*");
      if (params && params["project"] && projects && projects.length > 0) {
        let selectedProject = projects.filter(project => project.name.toLowerCase() === params["project"])[0];
        if (!selectedProject) {
          loggerService.error(`Project '${params["project"]}' doesn't exists`);
          routerService.history.push("/api-docs");
        }
        let newValue = selectedProject || null;
        if (this.selectedProjectStream.value !== newValue) {
          this.selectedProjectStream.next(newValue);
        }
      } else {
        if (this.selectedProjectStream.value !== null) {
          this.selectedProjectStream.next(null);
        }
      }
    }, e => this.loggerService.error(e));
  }

  public get projects(): Observable<Project[]> {
    return this.projectStream;
  }

  public refreshProjects() {
    this.projectClient.getProjects()
      .then(projects => {
        this.projectStream.next(projects);
      })
      .catch(e => this.loggerService.error("Failed to load projects", e));
  }

  public get selectedProject(): Observable<Project> {
    return this.selectedProjectStream;
  }

  public setSelectedProject(project: Project): void {
    if (this.selectedProjectStream.value !== project) {
      this.selectedProjectStream.next(project);
    }
  }

}
