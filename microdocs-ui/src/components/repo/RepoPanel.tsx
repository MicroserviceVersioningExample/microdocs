import { AppBar } from "material-ui";
import { orange500 } from "material-ui/styles/colors";
import * as React from "react";
import RepoControls from "./RepoControls";
import "./RepoPanel.css";

export default class RepoPanel extends React.Component<any, any> {

  public render() {
    return (
      <div className="repo-panel">
        <AppBar
            title={this.props.match.params.repo.toLowerCase()}
            showMenuIconButton={false}
            style={{backgroundColor: orange500}}
            iconElementRight={<RepoControls />}
        />
      </div>
    );
  }

//  private getRepoName(){
//    if(this.props)
//  }

}
