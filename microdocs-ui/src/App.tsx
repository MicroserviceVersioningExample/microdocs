import { getMuiTheme } from "material-ui/styles";
import { blue400, blue500, blue700, orange200 } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import { Route, Router } from "react-router";
import { HashRouter } from "react-router-dom";
import "./App.css";
import LoginRoute from "./components/routes/LoginRoute";
import { ProjectRoute } from "./components/routes/ProjectRoute";
import UserRoute from "./components/routes/UserRoute";
import { routerService } from "./services/index";

const muiTheme = getMuiTheme({
  appBar: {
    height: 70,
    color: blue500
  },
  stepper: {
    iconColor: blue400
  },
  palette: {
    primary1Color: blue500,
    primary2Color: blue700,
    accent1Color: orange200
  }
});

routerService.redirect("/", "/api-docs");
routerService.redirect("/api-docs/:project", "/api-docs/:project/overview");

class App extends React.Component {

  public render() {
    return (
      <HashRouter>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router history={routerService.history}>
            <div>
              <Route path="/api-docs" component={ProjectRoute}/>
              <Route path="/users" component={UserRoute}/>
              <Route path="/login" component={LoginRoute}/>
            </div>
          </Router>
        </MuiThemeProvider>
      </HashRouter>
    );
  }
}

export default App;
