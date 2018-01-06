import { Location } from "history";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { DocumentClient } from "../clients/document.client";
import { Document } from "../domain/document.model";
import { Project } from "../domain/project.model";
import { Repo } from "../domain/repo.model";
import { Tag } from "../domain/tag.model";
import { LoggerService } from "./logger.service";
import { ProjectService } from "./project.service";
import { RepoService } from "./repo.service";
import { RouterService } from "./router.service";

export class DocumentService {

  private documentStream = new ReplaySubject<Document>();
  private selectedRefStream = new ReplaySubject<Tag>();
  private selectedDocumentId: string;

  constructor(private documentClient: DocumentClient,
              private loggerService: LoggerService,
              private routerService: RouterService,
              private projectService: ProjectService,
              private repoService: RepoService) {
    Observable.combineLatest(projectService.selectedProject, repoService.selectedRepo, routerService.location)
      .subscribe(r => {
        let project: Project = r[0];
        let repo: Repo = r[1];
        let location: Location = r[2];

        if (project && repo) {

          // Find reference
          let query = routerService.parseSearch(location);
          let ref = query["ref"] || repo.latestTag;
          let tag = repo.tags.filter(tag => tag.id === ref)[0];
          if (!tag) {
            tag = { id: ref, name: ref, ref };
          }
          this.selectedRefStream.next(tag);

          // Load document
          this.loadDocument(project, repo, tag);
        } else {
          this.selectedRefStream.next(null);
        }
      });
  }

  public get selectedRef(): Observable<Tag> {
    return this.selectedRefStream;
  }

  private loadDocument(project: Project, repo: Repo, tag: Tag) {
    if (this.selectedDocumentId !== tag.ref) {
      this.documentClient.getDocument(project, repo, tag.ref).then(document => {
        if (document) {
          this.selectedDocumentId = document.id;
          this.documentStream.next(document);
        } else {
          this.loggerService.error(`Document '${tag.name}' doesn't exists`);
          this.documentStream.next(null);
        }
      }).catch(e => {
        this.loggerService.error(`Failed to load document ${tag.name}`, e);
      });
    }
  }

}
