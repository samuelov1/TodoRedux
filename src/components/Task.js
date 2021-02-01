import React, { Component } from "react";
import {
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Collapse,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import {
  CheckCircle,
  RadioButtonUnchecked,
  Edit,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import { toggleTaskCompleted, editTask, deleteTask } from "../redux/actions";
import TaskContextMenu from "./TaskContextMenu";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import DeleteDialog from "./DeleteDialog";
import AddTask from "./AddTask";

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
  },
  sublist: {
    marginLeft: "30px"
  }
});

class Task extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      sublistOpen: false
    };

    this.contextMenu = React.createRef();
    this.deleteDialog = React.createRef();

    this.handleClick = this.handleClick.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleSublist = this.toggleSublist.bind(this);
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

  toggleSublist() {
    this.setState(state => ({ sublistOpen: !state.sublistOpen }));
  }

  render() {
    const { id, content, isCompleted, subtasks } = this.props.task;
    const { classes, toggleTaskCompleted, task, deleteTask } = this.props;
    const { editMode, sublistOpen } = this.state;

    if (editMode) {
      return (
        <ListItem>
          <ListItemIcon className={classes.editIcon}>
            <Edit />
          </ListItemIcon>{" "}
          <TaskForm
            task={task}
            onCancel={this.toggleEditMode}
            onSubmit={this.handleEdit}
          />
        </ListItem>
      );
    }

    let secondaryText = null;
    let sublist = null;
    let expandListButton = null;

    if (subtasks) {
      const completedCount = subtasks.filter(task => task.isCompleted).length;
      const totalCount = subtasks.length;

      secondaryText = `${completedCount}/${totalCount} subtasks completed`;

      sublist = (
        <Collapse
          className={classes.sublist}
          in={sublistOpen}
          timeout="auto"
          unmountOnExit
        >
          <TaskList tasks={subtasks} />
          <AddTask parentTaskId={id} />
        </Collapse>
      );

      expandListButton = (
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={this.toggleSublist}
          >
            {sublistOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </ListItemSecondaryAction>
      );
    }

    return (
      <div>
        <ListItem
          className={classes.listItem}
          onContextMenu={this.handleClick}
          button
          disableRipple
        >
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
            secondary={secondaryText}
          />
          {expandListButton}
        </ListItem>
        <TaskContextMenu
          ref={this.contextMenu}
          onEdit={this.toggleEditMode}
          onDelete={this.handleDelete}
        />
        <DeleteDialog
          ref={this.deleteDialog}
          onConfirm={() => deleteTask(id)}
        />
        {sublist}
      </div>
    );
  }
}

export default connect(
  null,
  { toggleTaskCompleted, editTask, deleteTask }
)(withStyles(styles)(Task));
