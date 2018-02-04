import { blue500, orange500 } from "material-ui/styles/colors";
import * as React from "react";
import "./Header.css";

class Header extends React.Component {

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="header">
        <a className="logo" href="/" >
          <img src="assets/images/microdocs.png" alt="MicroDocs logo" className="logo-img" />
          <div className="logo-text">
            <span style={{color: blue500}}>Micro</span>
            <span style={{color: orange500}}>Docs</span>
          </div>
        </a>
      </div>
    );
  }

}

export default Header;
