import React, { Component } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";

export default class TaskContextMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseX: null,
      mouseY: null
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.open = this.open.bind(this);
  }

  handleClose() {
    this.setState({
      mouseX: null,
      mouseY: null
    });
  }

  open(event) {
    event.preventDefault();
    this.setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    });
  }

  handleEdit() {
    this.handleClose();
    this.props.onEdit();
  }

  handleDelete() {
    this.handleClose();
    this.props.onDelete();
  }

  render() {
    const { mouseX, mouseY } = this.state;

    return (
      <Menu
        keepMounted
        open={this.state.mouseY !== null}
        onClose={this.handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          mouseY !== null && mouseX !== null
            ? { top: mouseY, left: mouseX }
            : undefined
        }
      >
        <MenuItem onClick={this.handleEdit} dense>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={this.handleDelete} dense>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    );
  }
}
