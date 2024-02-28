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

  const onFileQuitClicked = async () => {
    // TODO: Implement "dirty check"
    await exit(0);
  };

  return (
    <Nav className="bg-light">
      <Dropdown as={NavItem}>
        <Dropdown.Toggle as={NavLink}>File</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onFileNewClicked}>New</Dropdown.Item>
          <Dropdown.Item onClick={onFileOpenClicked}>Open...</Dropdown.Item>
          <Dropdown.Item onClick={onFileSaveClicked}>Save</Dropdown.Item>
          <Dropdown.Item onClick={onFileSaveAsClicked}>
            Save As...
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={onFileQuitClicked}>Quit</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
};

export default MenuBar;
