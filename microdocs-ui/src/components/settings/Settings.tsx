import * as React from "react";
import { AppBar, IconButton } from "material-ui";
import { ActionHome } from "material-ui/svg-icons";
import { blueGrey500 } from "material-ui/styles/colors";

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