import {Avatar, Divider, List, ListItem, MenuItem, Subheader} from "material-ui";
import {blue500, green500, orange500} from "material-ui/styles/colors";
import Autorenew from "material-ui/svg-icons/action/autorenew";
import Code from "material-ui/svg-icons/action/code";
import Home from "material-ui/svg-icons/action/home";
import Settings from "material-ui/svg-icons/action/settings";
import Add from "material-ui/svg-icons/content/add";
import * as React from "react";
import {NavLink} from "react-router-dom";
import {Subscription} from "rxjs/Subscription";
import {Project} from "../../domain/project.model";
import {RepoTypes} from "../../domain/repo-types.model";
import {Repo} from "../../domain/repo.model";
import {projectService, repoService} from "../../services/index";
import "./SidebarList.css";

export default class SidebarList extends React.Component<any, { repos: Repo[] }> {
  
  private projectListener: Subscription;
  private reposListener: Subscription;
  private selectedProject: Project = {id: "", name: ""};
  private mounted: boolean;
  
  constructor(props: any) {
    super(props);
    this.state = {repos: []};
    
    this.reposListener = repoService.repos.subscribe(repos => {
      this.setState({repos: repos as Repo[]});
    });
    this.projectListener = projectService.selectedProject.subscribe(selectedProject => {
      this.selectedProject = selectedProject || {id: "", name: ""};
    });
  }
  
  public setState(state: any) {
    if (this.mounted) {
      super.setState(state);
    } else {
      this.state = state;
    }
  }
  
  public componentDidMount() {
    this.mounted = true;
  }
  
  public componentWillUnmount() {
    this.mounted = false;
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
            key={this.selectedProject.id + "-overview"}
            to={`/api-docs/${this.selectedProject.id}/overview`}
            activeClassName="active"
            className="navlink"
          >
            <ListItem
              primaryText="Overview"
              leftIcon={<Home/>}
            />
          </NavLink>
          <NavLink
            to={`/api-docs/${this.selectedProject.id}/create-repo`}
            key={this.selectedProject.id + "-create"}
            activeClassName="active"
            className="navlink"
          >
            <ListItem
              primaryText="Create Repository"
              leftIcon={<Add/>}
            />
          </NavLink>
        </List>
        <Divider/>
        <div className="repo-list">
          <List>
            <Subheader>Repositories</Subheader>
            {this.state.repos.map(repo => {
              return <NavLink
                to={`/api-docs/${this.selectedProject.id}/repos/${repo.id}`}
                activeClassName="active"
                className="navlink"
                key={this.selectedProject.id + repo.id}
              >
                <ListItem
                  primaryText={repo.name}
                  leftAvatar={repo.type === RepoTypes.Sync ? <Avatar icon={<Autorenew/>} backgroundColor={blue500}/> :
                    <Avatar icon={<Code/>} backgroundColor={orange500}/>}
                />
              </NavLink>;
            })}
          </List>
        </div>
        <div className="bottom-list">
          <Divider/>
          <List>
            <NavLink
              to={`/api-docs/${this.selectedProject.id}/settings`}
              key={this.selectedProject.id + "-settings"}
              activeClassName="active"
              className="navlink"
            >
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
