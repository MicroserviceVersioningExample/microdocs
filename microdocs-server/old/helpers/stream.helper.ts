import { Observable } from "rxjs/Observable";
import { Readable, Stream } from "stream";

/**
 * Convert Observable to a JSON stream
 * @param {Observable<any>} observable
 * @returns {"stream".internal.Stream}
 */
export function observableToJsonStream(observable: Observable<any>): Stream {
  let stream = new Readable();
  let reading = false;
  let first = true;
  stream._read = () => {
    if (!reading) {
      reading = true;
      stream.push("[");

      observable.subscribe(next => {
        if (first) {
          first = false;
        } else {
          stream.push(",");
        }
        stream.push("\n" + JSON.stringify(next));
      }, error => {
        stream.emit("error", error);
        stream.push(null);
      }, () => {
        stream.push("\n]");
        stream.push(null);
      });
    }
  };
  return stream;
}
