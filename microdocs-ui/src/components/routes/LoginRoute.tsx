
import { Paper } from "material-ui";
import * as React from "react";
import LoginPanel from "../auth/LoginPanel";
import Header from "../header/Header";
import "./LoginRoute.css";

export default class LoginRoute extends React.Component {

  public render() {
    return (
      <div className="login-route">
        <Header />
        <Paper className="login-wrapper">
          <LoginPanel />
        </Paper>
      </div>
    );
  }

}
