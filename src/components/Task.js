import React, { Component } from "react";
import {
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText
} from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked, Edit } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import { toggleTaskCompleted, editTask, deleteTask } from "../redux/actions";
import TaskContextMenu from "./TaskContextMenu";
import TaskForm from "./TaskForm";
import DeleteDialog from "./DeleteDialog";

const styles = ({ palette }) => ({
  listItem: {
    padding: "3px 0px",
    borderBottom: palette.divider
  },
  completed: {
    textDecoration: "line-through",
    color: palette.action.disabled
  },
  editIcon: {
    margin: "9px 0 0 9px",
    alignSelf: "flex-start"
  }
});

class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    };

    this.contextMenu = React.createRef();
    this.deleteDialog = React.createRef();

    this.handleClick = this.handleClick.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick(e) {
    if (!this.state.editMode) {
      this.contextMenu.current.open(e);
    }
  }

  toggleEditMode() {
    this.setState(state => ({
      editMode: !state.editMode
    }));
  }

  handleEdit(editedTask) {
    this.toggleEditMode();
    this.props.editTask(editedTask);
  }

  handleDelete() {
    this.deleteDialog.current.open();
  }

  render() {
    const { id, content, isCompleted } = this.props.task;
    const { classes, toggleTaskCompleted, task, deleteTask } = this.props;
    const { editMode } = this.state;

    const itemContent = editMode ? (
      <>
        <ListItemIcon className={classes.editIcon}>
          <Edit />
        </ListItemIcon>{" "}
        <TaskForm
          task={task}
          onCancel={this.toggleEditMode}
          onSubmit={this.handleEdit}
        />
      </>
    ) : (
      <>
        <ListItemIcon>
          <Checkbox
            icon={<RadioButtonUnchecked />}
            checkedIcon={<CheckCircle color="action" />}
            tabIndex={2}
            disableRipple
            checked={isCompleted}
            onChange={() => toggleTaskCompleted(id)}
          />
        </ListItemIcon>
        <ListItemText
          className={isCompleted ? classes.completed : ""}
          id={`text-label-${id}`}
          primary={content}
        />
        <TaskContextMenu
          ref={this.contextMenu}
          onEdit={this.toggleEditMode}
          onDelete={this.handleDelete}
        />
      </>
    );

    return (
      <ListItem
        className={classes.listItem}
        onContextMenu={this.handleClick}
        button
        disableRipple
      >
        {itemContent}
        <DeleteDialog
          ref={this.deleteDialog}
          onConfirm={() => deleteTask(id)}
        />
      </ListItem>
    );
  }
}

export default connect(
  null,
  { toggleTaskCompleted, editTask, deleteTask }
)(withStyles(styles)(Task));
