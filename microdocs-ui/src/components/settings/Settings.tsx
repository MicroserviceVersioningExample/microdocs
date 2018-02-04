import { AppBar } from "material-ui";
import { blueGrey500 } from "material-ui/styles/colors";
import * as React from "react";

export default class SettingsPanel extends React.Component {

  public render() {
    return (
      <div className="settings-panel">
        <AppBar
            title="Settings"
            showMenuIconButton={false}
            style={{backgroundColor: blueGrey500}}
        />
      </div>
    );
  }

}
