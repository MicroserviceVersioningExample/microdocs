import {LinearProgress} from "material-ui";
import * as React from "react";
import {Document} from "../../domain/document.model";
import "./DocumentPanel.css";

const swaggerUI: any = require("swagger-ui");

export default class DocumentPanel extends React.Component<{ document: Document }, { loaded: boolean }> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      loaded: !!this.props.document
    };
  }
  
  public componentDidMount() {
    this.setState({loaded: false});
    if (this.props.document) {
      swaggerUI({
        dom_id: "#swaggerContainer",
        spec: this.props.document || {},
        presets: [swaggerUI.presets.apis]
      });
      setTimeout(() => {
        this.setState({loaded: true});
      }, 100);
    }
  }
  
  public componentWillReceiveProps() {
    this.setState({loaded: false});
    if (this.props.document) {
      swaggerUI({
        dom_id: "#swaggerContainer",
        spec: this.props.document || {},
        presets: [swaggerUI.presets.apis]
      });
      setTimeout(() => {
        this.setState({loaded: true});
      }, 100);
    }
  }
  
  public render() {
    return (
      <div>
        <div className={"loading-bar " + (!this.state.loaded ? "show" : "")}>
          <LinearProgress mode="indeterminate" style={{borderRadius: "0px"}}/>
        </div>
        <div className={"document-panel " + (this.state.loaded ? "loaded" : "")} id="swaggerContainer"/>
      </div>);
  }
  
}
