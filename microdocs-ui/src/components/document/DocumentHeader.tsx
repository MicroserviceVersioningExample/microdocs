import { MicroDocsDocument } from "@maxxton/microdocs-core";
import * as React from "react";
import ReactMarkdown = require("react-markdown");
import "./DocumentHeader.css";
import { List, ListItem } from "material-ui";
import { ContentSend, SocialPublic, ActionAssignment, ActionBook } from "material-ui/svg-icons";

export default class DocumentHeader extends React.Component<{ document: MicroDocsDocument }, any> {

  public render() {
    if ( this.props.document && this.props.document.info ) {
      let document = this.props.document;
      let info     = document.info;

      return (
          <div className="document-info">
            <ReactMarkdown className="description" source={info.description}></ReactMarkdown>
            <div className="right-bar">
              <List>
                {document.externalDocs && document.externalDocs.url &&
                <a target="_blank" href={document.externalDocs.url}>
                  <ListItem primaryText={document.externalDocs.description || document.externalDocs.url} leftIcon={
                    <SocialPublic/>} hoverColor="rgba(255, 152, 0, 0.2)"/>
                </a>
                }
                {info.contact && (info.contact.url || info.contact.email) &&
                <a target="_blank" href={info.contact.url || "mailto:" + info.contact.email}>
                  <ListItem primaryText={info.contact.name || info.contact.url || info.contact.email} leftIcon={
                    <ContentSend/>} hoverColor="rgba(255, 152, 0, 0.2)"/>
                </a>
                }
                {info.contact && (info.contact.url || info.contact.email) &&
                <a target="_blank" href={info.termsOfService}>
                  <ListItem primaryText="Terms Of Service" leftIcon={
                    <ActionAssignment/>} hoverColor="rgba(255, 152, 0, 0.2)"/>
                </a>
                }
                {info.license && (info.license.url) &&
                <a target="_blank" href={info.license.url}>
                  <ListItem primaryText={info.license.name || "License"} leftIcon={
                    <ActionBook/>} hoverColor="rgba(255, 152, 0, 0.2)"/>
                </a>
                }
              </List>
            </div>
          </div>
      );
    } else {
      return <div className="document-info"/>;
    }
  }

}