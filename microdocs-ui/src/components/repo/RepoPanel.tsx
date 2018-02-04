import {
  AppBar, Dialog, Divider, FlatButton, IconButton, IconMenu, MenuItem, RaisedButton, SvgIcon, Toolbar,
  ToolbarGroup
} from "material-ui";
import {orange500, red500, white} from "material-ui/styles/colors";
import ActionBookmark from "material-ui/svg-icons/action/bookmark";
import ActionDelete from "material-ui/svg-icons/action/delete";
import ActionSettings from "material-ui/svg-icons/action/settings";
import ContentAdd from "material-ui/svg-icons/content/add";
import EditorInsertDriveFile from "material-ui/svg-icons/editor/insert-drive-file";
import ImageEdit from "material-ui/svg-icons/image/edit";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import * as React from "react";
import { Subscription } from "rxjs/Subscription";
import {documentService, loggerService, projectService, repoService, routerService} from "../../services";
import DocumentPanel from "../document/DocumentPanel";
import "./RepoPanel.css";
import RepoTagPanel from "./RepoTagPanel";

export default class RepoPanel extends React.Component<any, any> {

  private mounted = false;
  private docSubscription: Subscription;
  private repoSubscription: Subscription;

  constructor(props: any) {
    super(props);
    this.state = { document: null, repo: null, error: null, openDeleteDialog: false };
  
    this.repoSubscription = repoService.selectedRepo.subscribe(repo => {
      let state: any = this.state;
      state.repo = repo;
      this.setState(state);
    });
  
    this.docSubscription = documentService.document.subscribe(value => {
      let state: any = this.state;
      if (value instanceof Error) {
        state.document = null;
        state.error = value.message;
        this.setState(state);
      } else {
        state.document = value;
        state.error = null;
        this.setState(state);
      }
    });
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleOkDeleteDialog = this.handleOkDeleteDialog.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
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
    if (this.docSubscription) {
      this.docSubscription.unsubscribe();
    }
    if (this.repoSubscription) {
      this.repoSubscription.unsubscribe();
    }
  }
  
  public handleOpenDeleteDialog(): void {
    this.setState({openDeleteDialog: true});
  }
  
  public handleCloseDeleteDialog(): void {
    this.setState({openDeleteDialog: false});
  }
  
  public handleOkDeleteDialog(): void {
    this.setState({openDeleteDialog: false});
    repoService.deleteRepo(projectService.currentProject, this.state.repo.id).then(() => {
      loggerService.info("Repository " + this.state.repo.name + " is removed");
      routerService.history.push(`/api-docs/${projectService.currentProject.id}`);
    }).catch(e => loggerService.error(`Failed to delete repository`));
  }

  public render() {
    return (
      <div className="repo-panel">
        <Toolbar className="toolbar" style={{backgroundColor: orange500, color: white}}>
          <ToolbarGroup firstChild={true}>
            <h1>{this.props.match.params.repo.toLowerCase()}</h1>
            <RepoTagPanel/>
          </ToolbarGroup>
          <ToolbarGroup>
            
            <IconMenu
              iconButtonElement={<IconButton tooltipPosition="bottom-center" tooltip="New...">
                <ContentAdd color={white} />
              </IconButton>}
              anchorOrigin={{horizontal: "right", vertical: "top"}}
              targetOrigin={{horizontal: "right", vertical: "top"}}
            >
              <MenuItem primaryText="New Document" leftIcon={<EditorInsertDriveFile />} />
              <MenuItem primaryText="New Tag" leftIcon={<ActionBookmark />} />
            </IconMenu>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon color={white}/></IconButton>}
              anchorOrigin={{horizontal: "right", vertical: "top"}}
              targetOrigin={{horizontal: "right", vertical: "top"}}
            >
              <MenuItem primaryText="Edit Document" leftIcon={<ImageEdit />} />
              <MenuItem
                primaryText="Delete Document"
                leftIcon={<ActionDelete />}
                onClick={this.handleOpenDeleteDialog}
              />
              <Divider/>
              <MenuItem primaryText="Repository Settings" leftIcon={<ActionSettings />} />
            </IconMenu>
            {/*<IconButton*/}
              {/*tooltip="Remove Repository"*/}
              {/*tooltipPosition="bottom-center"*/}
              {/*style={{color: white}}*/}
              {/*color={white}*/}
            {/*>*/}
              {/*<ActionDelete color={white} style={{color: white}} />*/}
            {/*</IconButton>*/}
            
          </ToolbarGroup>
        </Toolbar>
        {this.state.error && (<div className="error-panel">
          <span>{this.state.error}</span>
        </div>)}

        {this.state.document && <DocumentPanel document={this.state.document}/>}
        
        <Dialog
          actions={[
            <FlatButton
              label="Cancel"
              primary={false}
              key="cancel-button"
              onClick={this.handleCloseDeleteDialog}
            />,
            <RaisedButton
              label="Delete Repository"
              primary={true}
              key="delete-button"
              buttonStyle={{backgroundColor: red500}}
              style={{marginLeft: "20px"}}
              onClick={this.handleOkDeleteDialog}
            />
          ]}
          modal={false}
          open={this.state.openDeleteDialog}
          onRequestClose={this.handleCloseDeleteDialog}
          title={"Delete Repository"}
          contentStyle={{width: "500px"}}
        >
          Do you really want to delete Repository <strong>{this.state.repo && this.state.repo.name}</strong>
        </Dialog>
      </div>
    );
  }

  //  private getRepoName(){
  //    if(this.props)
  //  }

}
