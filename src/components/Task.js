import React, { useState, useRef } from "react";
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
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import {
  toggleTaskCompleted,
  editTask,
  deleteTask,
  addSubtask
} from "../redux/actions/tasks";
import TaskContextMenu from "./TaskContextMenu";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import DeleteDialog from "./DeleteDialog";
import AddTask from "./AddTask";

const useStyles = makeStyles(({ palette }) => ({
  listItem: {
    padding: "3px 0px",
    borderBottom: "1px solid " + palette.divider
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
}));

function Task({ toggleTaskCompleted, task, deleteTask, addSubtask }) {
  const [editMode, setEditMode] = useState(false);
  const [addSubtaskMode, setAddSubtaskMode] = useState(false);
  const [sublistOpen, setSublistOpen] = useState(false);

  const contextMenu = useRef(null);
  const deleteDialog = useRef(null);

  const handleRightClick = e => {
    if (!editMode) {
      contextMenu.current.open(e);
    }
  };

  const handleEdit = editedTask => {
    setEditMode(false);
    editTask(editedTask);
  };

  const handleAddSubtask = () => {
    if (task.subtasks) {
      setSublistOpen(true);
    }
    setAddSubtaskMode(true);
  };

  const handleAddSublist = subtask => {
    const parentTaskId = task.id;
    addSubtask(subtask, parentTaskId);
    setSublistOpen(true);
  };

  const classes = useStyles();
  const { id, content, isCompleted, subtasks } = task;

  if (editMode) {
    return (
      <ListItem>
        <ListItemIcon className={classes.editIcon}>
          <Edit />
        </ListItemIcon>
        <TaskForm
          task={task}
          onCancel={() => setEditMode(false)}
          onSubmit={handleEdit}
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
          onClick={() => setSublistOpen(open => !open)}
        >
          {sublistOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItemSecondaryAction>
    );
  } else if (addSubtaskMode) {
    sublist = (
      <div className={classes.sublist}>
        <ListItem>
          <TaskForm
            onCancel={() => setAddSubtaskMode(false)}
            onSubmit={handleAddSublist}
          />
        </ListItem>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <ListItem
        className={classes.listItem}
        onContextMenu={handleRightClick}
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
        ref={contextMenu}
        onEdit={() => setEditMode(true)}
        onDelete={() => deleteDialog.current.open()}
        onAddSubtask={handleAddSubtask}
      />
      <DeleteDialog ref={deleteDialog} onConfirm={() => deleteTask(id)} />
      {sublist}
    </div>
  );
}

export default connect(
  null,
  { toggleTaskCompleted, editTask, deleteTask, addSubtask }
)(Task);
