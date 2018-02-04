import {DropDownMenu, IconButton, MenuItem} from "material-ui";
import { white } from "material-ui/styles/colors";
import * as React from "react";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Tag } from "../../domain/tag.model";
import { documentService, repoService, routerService } from "../../services/index";
import "./RepoTagPanel.css";

export default class RepoControls extends React.Component<any, { value: string, items: any[] }> {

  private subscription: Subscription;
  private mounted: boolean = false;

  constructor(params: any) {
    super(params);
    this.state = {
      value: "",
      items: []
    };

    this.subscription = Observable.combineLatest(repoService.selectedRepo, documentService.selectedRef).subscribe(r => {
      let repo = r[0];
      let ref = r[1];
      if (repo && ref) {
        let tags: Tag[] = repo.tags;
        if (tags.filter(t => t.id === ref.id).length === 0) {
          tags.push(ref);
        }
        this.setState({
          value: ref.id,
          items: repo.tags.map(tag => <MenuItem value={tag.id} key={tag.id} primaryText={tag.name}/>)
        });
      } else {
        this.setState({
          value: "",
          items: []
        });
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

  public handleChange = (event: any, index: number, value: string) => {
    this.setState({ value: value || "", items: this.state.items });
    routerService.navigateSearch({ ref: value });
  }

  public render() {

    return (
      <div className="repo-controls">
        <DropDownMenu
          className="tag-field"
          underlineStyle={{ display: "none" }}
          labelStyle={{ color: white }}
          maxHeight={300}
          value={this.state.value}
          onChange={this.handleChange}
        >
          {this.state.items}
        </DropDownMenu>
        <IconButton iconClassName="delete" />
      </div>
    );
  }

}
