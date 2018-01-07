import * as React from "react";
import { Document } from "../../domain/document.model";
//import DocumentHeader from "./DocumentHeader";
const SwaggerUI = require( "swagger-ui" );
import "./DocumentPanel.css";
//import "swagger-ui/dist/swagger-ui.css"

export default class DocumentPanel extends React.Component<{ document: Document }, any> {

  componentDidMount() {
    SwaggerUI( {
      dom_id: '#swaggerContainer',
      spec: this.props.document || {},
      presets: [ SwaggerUI.presets.apis ]
    } );
  }

  componentWillUpdate() {
    SwaggerUI( {
      dom_id: '#swaggerContainer',
      spec: this.props.document || {},
      presets: [ SwaggerUI.presets.apis ]
    } );
  }

  public render() {
    return <div className="document-panel" id="swaggerContainer"/>;
  }

}
