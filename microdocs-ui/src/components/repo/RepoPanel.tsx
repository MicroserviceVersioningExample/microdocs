import { AppBar } from "material-ui";
import { orange500 } from "material-ui/styles/colors";
import * as React from "react";
import RepoControls from "./RepoControls";
import "./RepoPanel.css";
import DocumentPanel from "../document/DocumentPanel";
import { documentService } from "../../services";
import { Subscription } from "rxjs/Subscription";

export default class RepoPanel extends React.Component<any, any> {

  private mounted = false;
  private subscription: Subscription;

  constructor( props: any ) {
    super( props );
    this.state = { document: null };

    this.subscription = documentService.document.subscribe( document => {
      console.info("set document: ", document);
      this.setState( { document: document } );
    } );
  }

  public setState( state: any ) {
    if ( this.mounted ) {
      super.setState( state );
    } else {
      this.state = state;
    }
  }

  public componentDidMount() {
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
    if ( this.subscription ) {
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
          <DocumentPanel document={this.state.document}/>
        </div>
    );
  }

//  private getRepoName(){
//    if(this.props)
//  }

}
