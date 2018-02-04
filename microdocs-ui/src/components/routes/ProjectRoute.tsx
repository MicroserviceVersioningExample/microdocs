import * as React from "react";
import { Route, Switch } from "react-router";
import CreateRepoPanel from "../create-repo/CreateRepoPanel";
import OverviewPanel from "../overview/OverviewPanel";
import RepoPanel from "../repo/RepoPanel";
import SettingsPanel from "../settings/Settings";
import Sidebar from "../sidebar/Sidebar";
import "./ProjectRoute.css";

export class ProjectRoute extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
        <div className="project-route">
          <Sidebar/>
          <div className="content">
            <Switch>
              <Route path="/api-docs/:project/overview" exact={true} component={OverviewPanel}/>
              <Route path="/api-docs/:project/settings" exact={true} component={SettingsPanel}/>
              <Route path="/api-docs/:project/create-repo" exact={true} component={CreateRepoPanel}/>
              <Route path="/api-docs/:project/repos/:repo" component={RepoPanel}/>
            </Switch>
          </div>
        </div>
      );
  }

}
