
import * as React from "react";
import { DropDownMenu, MenuItem } from "material-ui";
import "./RepoControls.css";
import { white } from "material-ui/styles/colors";

export default class RepoControls extends React.Component<any, {value: string}> {

  constructor(params: any){
    super(params);
    this.state = {
      value: "1.0.0"
    }
  }

  public render() {
    let items = [
      <MenuItem value="1.0.0" key="1.0.0" primaryText="1.0.0"  />,
      <MenuItem value="1.1.0" key="1.1.0" primaryText="1.1.0"  />,
      <MenuItem value="2.0.0" key="2.0.0" primaryText="2.0.0"  />
    ];

    return (
        <div className="repo-controls">
          <DropDownMenu
              className="tag-field"
              underlineStyle={{display: "none"}}
              labelStyle={{color: white}}
              maxHeight={300}
              value={this.state.value} >
            {items}
          </DropDownMenu>
        </div>
    );
  }

}