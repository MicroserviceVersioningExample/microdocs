import * as React from "react";
import { Document } from "../../domain/document.model";
import "./DocumentPanel.css";

const swaggerUI: any = require("swagger-ui");

export default class DocumentPanel extends React.Component<{ document: Document }, any> {

  public componentDidMount() {
    swaggerUI({
      dom_id: "#swaggerContainer",
      spec: this.props.document || {},
      presets: [ swaggerUI.presets.apis ]
    });
  }

  public componentWillUpdate() {
    swaggerUI({
      dom_id: "#swaggerContainer",
      spec: this.props.document || {},
      presets: [ swaggerUI.presets.apis ]
    });
  }

  public render() {
    return <div className="document-panel" id="swaggerContainer"/>;
  }

}
