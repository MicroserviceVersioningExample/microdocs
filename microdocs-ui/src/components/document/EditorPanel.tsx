import * as React from "react";
import AceEditor from "react-ace";
import {Document} from "../../domain/document.model";
import DocumentPanel from "./DocumentPanel";
import "./EditorPanel.css";

const yaml: any = require("yaml-js");

import * as ace from "brace";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import "brace/mode/yaml";
import "brace/theme/tomorrow_night_eighties";
import {documentService} from "../../services";
// import "./brace-snippets-yaml";

export default class EditorPanel
  extends React.Component<EditorPanelProps, { document: Document, rawDocument: string, error: string }> {
  
  public readonly name: string;
  
  constructor(props: EditorPanelProps) {
    super(props);
    this.name = props.name;
    
    this.state = {
      error: "",
      document: documentService.parseDocument(props.document),
      rawDocument: documentService.formatDocument(this.props.document)
    };
    
    this.props.onChange({target: this}, props.document);
    
    this.handleChange = this.handleChange.bind(this);
  }
  
  public render() {
    return (
      <div className={"editor-panel " + (this.props.className || "")}>
        <div className="editor">
          {this.state.error && <span className="error">{this.state.error}</span>}
          {/*<textarea*/}
          {/*readOnly={this.props.readOnly}*/}
          {/*name={this.props.name}*/}
          {/*onKeyUp={this.handleChange}*/}
          {/*onChange={this.handleChange}*/}
          {/*value={this.state.rawDocument}*/}
          {/*/>*/}
          <AceEditor
            mode="yaml"
            theme="tomorrow_night_eighties"
            onChange={this.handleChange}
            name={this.props.name}
            value={this.state.rawDocument}
            readOnly={this.props.readOnly}
            width="100%"
            height="100%"
            tabSize={2}
            fontSize={12}
            wrapEnabled={true}
            editorProps={{
              display_indent_guides: true,
              folding: "markbeginandend"
            } as any}
            setOptions={{
              cursorStyle: "smooth",
              wrapBehavioursEnabled: true
            }}
          />
        </div>
        <div className="viewer">
          <DocumentPanel document={this.state.document}/>
        </div>
      </div>
    );
  }
  
  private handleChange(newValue?: string): any {
    let document = documentService.parseDocument(newValue);
    this.props.onChange({target: this}, newValue);
    this.setState({rawDocument: newValue});
    if (document) {
      this.setState({document, error: ""});
    } else {
      this.setState({error: "Invalid JSON"});
      this.props.onError("Invalid JSON");
    }
  }
  
}

export interface EditorPanelProps {
  
  document: string;
  className?: string;
  readOnly?: boolean;
  name?: string;
  onChange?: (event: any, document: string) => void;
  onError?: (error: string) => void;
  
}

// nieuwlied bad beatchhous
