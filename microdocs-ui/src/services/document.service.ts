import {Location} from "history";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import {DocumentClient} from "../clients/document.client";
import {Document} from "../domain/document.model";
import {Project} from "../domain/project.model";
import {Repo} from "../domain/repo.model";
import {Tag} from "../domain/tag.model";
import {LoggerService} from "./logger.service";
import {ProjectService} from "./project.service";
import {RepoService} from "./repo.service";
import {RouterService} from "./router.service";

const yaml: any = require("yaml-js");

export class DocumentService {
  
  private documentStream = new BehaviorSubject<Document | Error>(null);
  private selectedRefStream = new BehaviorSubject<Tag>(null);
  
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
            if (ref) {
              tag = {id: ref, name: ref, ref};
            } else {
              tag = null;
            }
          }
          if (tag !== this.selectedRefStream.value) {
            this.selectedRefStream.next(tag);
          }
          
          // Load document
          this.loadDocument(project, repo, tag);
        } else {
          if (this.selectedRefStream.value !== null) {
            this.selectedRefStream.next(null);
          }
        }
      });
  }
  
  /**
   * Get the selectedRef stream
   * @returns {Observable<Tag>}
   */
  public get selectedRef(): Observable<Tag> {
    return this.selectedRefStream;
  }
  
  /**
   * Get the document stream
   * @returns {Observable<Document | Error>}
   */
  public get document(): Observable<Document | Error> {
    return this.documentStream;
  }
  
  /**
   * Create document with optional a tag
   * @param {Project} project
   * @param {Repo} repo
   * @param {Document} document
   * @param {string} tag
   * @return {Promise<Document>}
   */
  public createDocument(project: Project, repo: Repo, document: Document, tag?: string): Promise<Document> {
    return this.documentClient.createDocument(project, repo, document, tag);
  }
  
  /**
   * Format a yaml document
   * @param {string} value
   * @return {string}
   */
  public formatDocument(value: string): string {
    return this.stringifyDocument(this.parseDocument(value));
  }
  
  /**
   * Stringify document into yaml
   * @param {Document} document
   * @return {string}
   */
  public stringifyDocument(document: Document): string {
    if (!document || Object.keys(document).length === 0) {
      return "";
    }
    return yaml.dump(document);
  }
  
  /**
   * Parse yaml or json document
   * @param {string} value
   * @return {Document}
   */
  public parseDocument(value: string): Document {
    try {
      return yaml.load(value) as Document;
    } catch (e) {
      try {
        return JSON.parse(value) as Document;
      } catch (e) {
        return null;
      }
    }
  }
  
  /**
   * Get selected document id
   * @returns {string}
   */
  private getSelectedDocumentId(): string | null {
    return this.documentStream.value && (this.documentStream.value as Document).id || null;
  }
  
  /**
   * Load document an push it to the documentStream
   * @param {Project} project
   * @param {Repo} repo
   * @param {Tag} tag
   */
  private loadDocument(project: Project, repo: Repo, tag: Tag) {
    this.documentStream.next(null);
    if (!tag) {
      this.documentStream.next(new Error(`There are no documents yet`));
    } else if (!tag.ref) {
      this.documentStream.next(new Error(`Cannot find Document '${tag.name}'`));
    } else if (this.getSelectedDocumentId() !== tag.ref) {
      this.documentClient.getDocument(project, repo, tag.ref).then(document => {
        if (document) {
          if (this.documentStream.value !== document) {
            this.documentStream.next(document);
          }
        } else {
          this.documentStream.next(new Error(`Cannot find Document '${tag.name}'`));
        }
      }).catch(e => {
        this.loggerService.error(`Failed to load document ${tag.name}`, e);
        this.documentStream.next(new Error(`Failed to load document ${tag.name}`));
      });
    }
  }
  
}
