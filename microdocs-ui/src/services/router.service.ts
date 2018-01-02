import { Action, createHashHistory, History, Location } from "history";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { red50 } from "material-ui/styles/colors";

/**
 * Router Service
 */
export class RouterService {

  private locationStream                        = new ReplaySubject<Location>();
  private _history: History;
  private redirects: { [path: string]: string } = {};

  constructor() {
    this._history = createHashHistory( {} );
    this._history.listen( ( location, action ) => {
      this.locationStream.next( location );
      this.checkRedirects( this._history.location );
    } );
    this.locationStream.next( this._history.location );
    this.checkRedirects( this._history.location );
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
  public redirect( originalPath: string, targetPath: string ) {
    this.redirects[ originalPath.toLowerCase() ] = targetPath;
    this.checkRedirects( this._history.location );
  }

  private checkRedirects( location: Location ) {
    if ( this.redirects[ location.pathname.toLowerCase() ] ) {
      this._history.replace( this.redirects[ location.pathname.toLowerCase() ] );
    } else {
      let original = location.pathname.split( "/" );
      Object.keys( this.redirects ).some( redirect => {
        let segments  = redirect.split( "/" );
        let vars: any = {};
        if ( original.length === segments.length ) {
          let match = true;
          for ( let i = 0; i < original.length; i++ ) {
            let originalSegment = original[ i ];
            let redirectSegment = segments[ i ];
            if ( redirectSegment.indexOf( ":" ) === 0 ) {
              vars[ redirectSegment.substr( 1 ) ] = originalSegment;
            } else {
              if ( redirectSegment.toLowerCase() !== originalSegment.toLowerCase() ) {
                match = false;
                break;
              }
            }
          }
          if ( match ) {
            let redirectUrl = this.redirects[redirect];
            Object.keys(vars).forEach(name => {
              redirectUrl = redirectUrl.replace(new RegExp(":" + name, "g"), vars[name]);
            });
            this._history.replace( redirectUrl );
            return true;
          }
        }
        return false;
      } );
    }
  }

}
