import React from "react";
import { exit } from "@tauri-apps/api/process";
import { Nav, NavItem, NavLink, Dropdown } from "react-bootstrap";
import "./MenuBar.css";

const MenuBar: React.FC = () => {
  const onFileNewClicked = async () => {
    // TODO: Implement
  };

  const onFileOpenClicked = async () => {
    // TODO: Implement
  };

  const onFileSaveClicked = async () => {
    // TODO: Implement
  };

  const onFileSaveAsClicked = async () => {
    // TODO: Implement
  };

  return (
    <Nav className="bg-light">
      <Dropdown as={NavItem}>
        <Dropdown.Toggle as={NavLink} className="unselectable">File</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item className="unselectable" onClick={onFileNewClicked}>New</Dropdown.Item>
          <Dropdown.Item className="unselectable" onClick={onFileOpenClicked}>Open...</Dropdown.Item>
          <Dropdown.Item className="unselectable" onClick={onFileSaveClicked}>Save</Dropdown.Item>
          <Dropdown.Item className="unselectable" onClick={onFileSaveAsClicked}>
            Save As...
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
};

export default MenuBar;
