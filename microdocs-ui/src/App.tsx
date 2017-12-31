import { getMuiTheme } from "material-ui/styles";
import { black, blue500, white } from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import { Route, Router } from "react-router";
import { HashRouter } from "react-router-dom";
import "./App.css";
import { ProjectRoute } from "./components/routes/ProjectRoute";
import Sidebar from "./components/sidebar/Sidebar";
import { routerService } from "./services/index";

const muiTheme = getMuiTheme({
  appBar: {
    height: 70,
    color: blue500
  },
});

routerService.redirect("/", "/projects");

class App extends React.Component {

  public render() {
    return (
      <HashRouter>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Router history={routerService.history}>
            <Route path="/projects" component={ProjectRoute} />
          </Router>
        </MuiThemeProvider>
      </HashRouter>
    );
  }
}

export default App;
