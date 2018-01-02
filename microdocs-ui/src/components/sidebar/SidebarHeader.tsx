import { MenuItem, SelectField } from "material-ui";
import { black, blue500, white } from "material-ui/styles/colors";
import * as React from "react";
import { Subscription } from "rxjs/Subscription";
import { projectService, routerService } from "../../services/index";
import "./SidebarHeader.css";

export default class SidebarHeader extends React.Component<any, any> {

  private projectsListener: Subscription;
  private selectedProjectListener: Subscription;

  constructor(props: any) {
    super(props);
    this.state = { project: "", projects: [] };

    this.projectsListener = projectService.projects.subscribe(projects => {
      let items = projects.map(
        project => <MenuItem value={project.id} key={project.id} primaryText={project.name}/>);
      this.setState({
        project: this.state.project,
        projects: items
      });
    });

    this.selectedProjectListener = projectService.selectedProject.subscribe(selectedProject => {
      this.setState({
        project: selectedProject ? selectedProject.id : "",
        projects: this.state.projects
      });
    });

    this.handleChange = this.handleChange.bind(this);
  }

  public componentWillUnmount() {
    if (this.projectsListener) {
      this.projectsListener.unsubscribe();
    }
    if (this.selectedProjectListener) {
      this.selectedProjectListener.unsubscribe();
    }
  }

  public handleChange = (event: any, index: number, value: string) => {
    this.setState({ project: value, projects: this.state.projects });
    routerService.history.push(`/api-docs/${value}`);
  }

  public render() {
    return (
      <div className="sidebar-header" style={{ backgroundColor: blue500 }}>
        <a href="/">
          <span className="title">MicroDocs</span>
        </a>
        <div className="bg-image left"/>
        <div className="bg-image right"/>
        <SelectField
          className="selectfield"
          value={this.state.project}
          onChange={this.handleChange}
          maxHeight={200}
          labelStyle={{ color: white }}
          listStyle={{ color: black }}
          selectedMenuItemStyle={{ color: blue500 }}
        >
          {this.state.projects}
        </SelectField>
      </div>
    );
  }

}
