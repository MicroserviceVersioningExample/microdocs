import { createHashHistory, History, Location } from "history";
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
   * Parse path variable
   * @param {Location} location
   * @param {string} path
   * @returns {{[key: string]: string}}
   */
  public parsePath(location: Location, path: string): { [key: string]: string } {
    let originalSegments = location.pathname.split("/");
    while (originalSegments[originalSegments.length - 1] === "" && originalSegments.length > 0) {
      originalSegments = originalSegments.splice(0, originalSegments.length - 1);
    }
    let pathSegments = path.split("/");
    let params: { [key: string]: string } = {};
    if (originalSegments.length === pathSegments.length ||
      (pathSegments[pathSegments.length - 1] === "*" && originalSegments.length >= pathSegments.length - 1)) {
      let match = true;
      for (let i = 0; i < pathSegments.length; i++) {
        let originalSegment = originalSegments[i];
        let pathSegment = pathSegments[i];
        if (pathSegment !== "*") {
          if (pathSegment.indexOf(":") === 0) {
            params[pathSegment.substr(1)] = originalSegment;
          } else {
            if (pathSegment.toLowerCase() !== originalSegment.toLowerCase()) {
              match = false;
              break;
            }
          }
        }
      }
      if (match) {
        return params;
      }
    }
    return null;
  }

  /**
   * Navigate only search params
   * @param {any} string
   */
  public navigateSearch(searchParams: { [key: string ]: string}) {
    let searchQuery = Object.keys(searchParams).map(key => key + "=" + searchParams[key]).join("&");
    let uri = this._history.location.pathname + "?" + searchQuery;
    this._history.push(uri);
  }

  /**
   * Parse search query
   * @param {Location} location
   * @returns {{[p: string]: string}}
   */
  public parseSearch(location: Location): { [key: string]: string } {
    let search = location.search;
    if (search.startsWith("?")) {
      search = search.substring(1);
    }
    let params: { [key: string]: string } = {};
    search.split("&").forEach(pairString => {
      let pair = pairString.split("=");
      if (pair.length === 1) {
        params[pair[0]] = "";
      } else if (pair.length >= 2) {
        params[pair[0]] = pair[1];
      }
    });
    return params;
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
    } else {
      Object.keys(this.redirects).some(redirect => {
        let params = this.parsePath(location, redirect);
        if (params) {
          let redirectUrl = this.redirects[redirect];
          Object.keys(params).forEach(name => {
            redirectUrl = redirectUrl.replace(new RegExp(":" + name, "g"), params[name]);
          });
          this._history.replace(redirectUrl);
          return true;
        }
        return false;
      });
    }
  }

}
