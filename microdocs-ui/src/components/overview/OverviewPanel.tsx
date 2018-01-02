import * as React from "react";
import { AppBar, IconButton } from "material-ui";
import { ActionHome } from "material-ui/svg-icons";

export default class OverviewPanel extends React.Component {

  public render() {
    return (
      <div className="overview-panel">
        <AppBar
            title="Overview"
            showMenuIconButton={false}

        />
      </div>
    );
  }

}