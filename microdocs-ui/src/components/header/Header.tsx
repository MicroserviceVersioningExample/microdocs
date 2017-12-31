import { AppBar } from "material-ui";
import * as React from "react";

class Header extends React.Component<any, {open: boolean}> {

  constructor(props: any) {
    super(props);
    this.state = { open: true };
  }

  public render() {
    return (
      <div>
        <AppBar title="MicroDocs"/>
      </div>
    );
  }

}

export default Header;
