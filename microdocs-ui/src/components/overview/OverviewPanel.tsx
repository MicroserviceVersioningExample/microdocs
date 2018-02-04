import { AppBar } from "material-ui";
import * as React from "react";

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
