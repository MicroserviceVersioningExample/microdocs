import { Avatar, Divider, List, ListItem, MenuItem, Subheader } from "material-ui";
import Home from "material-ui/svg-icons/action/home";
import Settings from "material-ui/svg-icons/action/settings";
import Code from "material-ui/svg-icons/action/code";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Subscription } from "rxjs/Subscription";
import { Project } from "../../domain/project.model";
import { Repo } from "../../domain/repo.model";
import { projectService, repoService } from "../../services/index";
import "./SidebarList.css";
import { blue500, orange500 } from "material-ui/styles/colors";

export default class SidebarList extends React.Component<any, { repos: Repo[] }> {

  private projectListener: Subscription;
  private reposListener: Subscription;
  private selectedProject: Project = { id: "", name: "" };

  constructor(props: any) {
    super(props);
    this.state = { repos: [] };

    this.reposListener = repoService.repos.subscribe(repos => {
      this.setState({ repos: repos as Repo[] });
    });
    this.projectListener = projectService.selectedProject.subscribe(selectedProject => {
      this.selectedProject = selectedProject || { id: "", name: "" };
    });
  }

  public componentWillUnmount() {
    if (this.reposListener) {
      this.reposListener.unsubscribe();
    }
    if (this.projectListener) {
      this.projectListener.unsubscribe();
    }
  }

  public render() {
    return (
      <div className="sidebar-list">
        <List>
          <NavLink
            key={this.selectedProject.id}
            to={`/api-docs/${this.selectedProject.id}/overview`}
            activeClassName="active"
            className="navlink">
            <ListItem
              primaryText="Overview"
              leftIcon={<Home/>}
            />
          </NavLink>
        </List>
        <Divider/>
        <List>
          <Subheader>Repositories</Subheader>
          {this.state.repos.map(repo => {
            return <NavLink
              to={`/api-docs/${this.selectedProject.id}/repos/${repo.id}`}
              activeClassName="active"
              className="navlink"
              key={this.selectedProject.id + repo.id}>
              <ListItem
                primaryText={repo.name}
                leftAvatar={<Avatar icon={<Code />} backgroundColor={orange500} />}
              />
            </NavLink>;
          })}
        </List>
        <div className="bottom-list">
          <Divider/>
          <List>
            <NavLink
              to={`/api-docs/${this.selectedProject.id}/settings`}
              key={this.selectedProject.id}
              activeClassName="active"
              className="navlink" >
              <ListItem
                primaryText="Settings"
                leftIcon={<Settings/>}
              />
            </NavLink>
          </List>
        </div>
      </div>
    );
  }

}
