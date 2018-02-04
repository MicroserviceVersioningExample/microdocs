import { AppBar, SvgIcon } from "material-ui";
import { orange500 } from "material-ui/styles/colors";
import * as React from "react";
import { Subscription } from "rxjs/Subscription";
import { documentService } from "../../services";
import DocumentPanel from "../document/DocumentPanel";
import RepoControls from "./RepoControls";
import "./RepoPanel.css";

export default class RepoPanel extends React.Component<any, any> {

  private mounted = false;
  private subscription: Subscription;

  constructor(props: any) {
    super(props);
    this.state = { document: null, error: null };

    this.subscription = documentService.document.subscribe(value => {
      if (value instanceof Error) {
        this.setState({ document: null, error: value.message });
      } else {
        this.setState({ document: value, error: null });
      }
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public render() {
    return (
      <div className="repo-panel">
        <AppBar
          title={this.props.match.params.repo.toLowerCase()}
          showMenuIconButton={false}
          style={{ backgroundColor: orange500 }}
          iconElementRight={<RepoControls/>}
        />
        {this.state.error && (<div className="error-panel">
          <span>{this.state.error}</span>
        </div>)}

        {this.state.document && <DocumentPanel document={this.state.document}/>}
      </div>
    );
  }

  //  private getRepoName(){
  //    if(this.props)
  //  }

}
