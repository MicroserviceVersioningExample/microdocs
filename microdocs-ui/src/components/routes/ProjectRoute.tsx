import * as React from "react";
import Sidebar from "../sidebar/Sidebar";
import { Route, Switch } from "react-router";
import "./ProjectRoute.css";
import OverviewPanel from "../overview/OverviewPanel";
import SettingsPanel from "../settings/Settings";
import RepoPanel from "../repo/RepoPanel";

export class ProjectRoute extends React.Component<any, any> {

  constructor( props: any ) {
    super( props );
  }

  public render() {
    return (
        <div className="project-route">
          <Sidebar/>
          <div className="content">
            <Switch>
              <Route path="/api-docs/:project/overview" exact component={OverviewPanel}/>
              <Route path="/api-docs/:project/settings" exact component={SettingsPanel}/>
              <Route path="/api-docs/:project/repos/:repo" component={RepoPanel}/>
            </Switch>
          </div>
        </div>
      );
  }

}
