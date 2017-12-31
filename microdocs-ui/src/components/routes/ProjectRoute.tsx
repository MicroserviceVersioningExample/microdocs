import * as React from "react";
import Sidebar from "../sidebar/Sidebar";

export class ProjectRoute extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Sidebar/>
    );
  }

}
