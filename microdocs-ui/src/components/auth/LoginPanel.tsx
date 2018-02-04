import { RaisedButton, TextField } from "material-ui";
import { blue500, orange500 } from "material-ui/styles/colors";
import * as React from "react";
import { userService } from "../../services/index";
import "./LoginPanel.css";

export default class LoginPanel extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      userNameError: "",
      passwordError: "",
      username: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  public render() {
    return (
      <div className="login-panel">
        <form onSubmit={this.handleSubmit}>
          <h1 style={{ color: "#333" }}>Login</h1>
          <TextField
            className="text-field"
            floatingLabelText="Username"
            type="text"
            floatingLabelFocusStyle={{ color: blue500 }}
            underlineFocusStyle={{ borderColor: blue500 }}
            errorText={this.state.usernameError}
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
          <TextField
            className="text-field"
            floatingLabelText="Password"
            type="password"
            floatingLabelFocusStyle={{ color: blue500 }}
            underlineFocusStyle={{ borderColor: blue500 }}
            errorText={this.state.passwordError}
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <RaisedButton
            className="login-button"
            label="Login"
            primary={true}
            buttonStyle={{ backgroundColor: blue500 }}
            type="submit"
          />
        </form>
      </div>
    );
  }

  private handleSubmit(event: React.FormEvent<any>): void {
    let username = this.state.username;
    let password = this.state.password;
    let validUsername = this.validateUsername(username);
    let validPassword = this.validatePassword(password);
    if (validUsername && validPassword) {
      userService.login(username, password);
    }
  }

  private handleUsernameChange(event: any): void {
    this.validateUsername(event.target.value);
    this.setState({ username: event.target.value });
  }

  private handlePasswordChange(event: any): void {
    this.validatePassword(event.target.value);
    this.setState({ password: event.target.value });
  }

  private validateUsername(username: string): boolean {
    if (username.trim() === "") {
      this.setState({ usernameError: "Username is required" });
      return false;
    } else {
      this.setState({ usernameError: "" });
      return true;
    }
  }

  private validatePassword(password: string): boolean {
    if (password.trim() === "") {
      this.setState({ passwordError: "Password is required" });
      return false;
    } else {
      this.setState({ passwordError: "" });
      return true;
    }
  }

}
