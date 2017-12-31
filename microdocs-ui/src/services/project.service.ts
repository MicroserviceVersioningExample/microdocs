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

      let segments = location.pathname.split("/");
      let selectedProject: Project;
      if (segments.length >= 3 && segments[1] === "projects") {
        selectedProject = projects.filter(project => project.name.toLowerCase() === segments[2])[0];
        if (!selectedProject) {
          loggerService.error(`Project '${segments[2]}' doesn't exists`);
          routerService.history.push("/projects");
        }
      }
      if (selectedProject) {
        this.selectedProjectStream.next(selectedProject);
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
