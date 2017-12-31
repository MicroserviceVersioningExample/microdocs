
import * as React from "react";
import "./Sidebar.css";
import SidebarHeader from "./SidebarHeader";
import SidebarList from "./SidebarList";

export default class Sidebar extends React.Component<any, any> {

  public render() {
    return (
      <div className="sidebar">
        <SidebarHeader/>
        <SidebarList/>
      </div>
    );
  }

}
