import { Action, createHashHistory, History, Location } from "history";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";

/**
 * Router Service
 */
export class RouterService {

  private locationStream = new ReplaySubject<Location>();
  private _history: History;
  private redirects: { [path: string]: string } = {};

  constructor() {
    this._history = createHashHistory({});
    this._history.listen((location, action) => {
      this.locationStream.next(location);
      this.checkRedirects(this._history.location);
    });
    this.locationStream.next(this._history.location);
    this.checkRedirects(this._history.location);
  }

  public get history(): History {
    return this._history;
  }

  public get location(): Observable<Location> {
    return this.locationStream;
  }

  /**
   * Add redirect
   * @param {string} originalPath
   * @param {string} targetPath
   */
  public redirect(originalPath: string, targetPath: string) {
    this.redirects[originalPath.toLowerCase()] = targetPath;
    this.checkRedirects(this._history.location);
  }

  private checkRedirects(location: Location) {
      if (this.redirects[location.pathname.toLowerCase()]) {
        this._history.replace(this.redirects[location.pathname.toLowerCase()]);
      }
  }

}
