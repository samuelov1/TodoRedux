import React, { useState, useRef } from "react";
import {
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Collapse,
  ListItemSecondaryAction,
  IconButton,
  List
} from "@material-ui/core";
import {
  CheckCircle,
  RadioButtonUnchecked,
  Edit,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import TaskContextMenu from "./TaskContextMenu";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import DeleteDialog from "./DeleteDialog";
import AddTask from "./AddTask";
import {
  useSetCompletedMutation,
  useAddTaskMutation,
  useRemoveTaskMutation,
  useUpdateTaskMutation
} from "../hooks/tasks";
import { useQueryClient } from "react-query";

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

const Task = ({ task }) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [addSubtaskMode, setAddSubtaskMode] = useState(false);
  const [sublistOpen, setSublistOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: setTaskCompleted } = useSetCompletedMutation(queryClient);
  const { mutate: addTask } = useAddTaskMutation(queryClient);
  const { mutate: removeTask } = useRemoveTaskMutation(queryClient);
  const { mutate: updateTask } = useUpdateTaskMutation(queryClient);

  const contextMenu = useRef(null);
  const deleteDialog = useRef(null);

  const handleRightClick = (e) => {
    if (!editMode) {
      contextMenu.current.open(e);
    }
  };

  const handleEdit = (editedTask) => {
    setEditMode(false);
    updateTask(editedTask);
  };

  const handleAddSubtask = () => {
    if (task.subtasks.length > 0) {
      setSublistOpen(true);
    }
    setAddSubtaskMode(true);
  };

  const handleAddSublist = (subtask) => {
    addTask({ ...subtask, parentId: id });
    setSublistOpen(true);
  };

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

  const { _id: id, content, isCompleted, subtasks, parentId } = task;

  let secondaryText = null;
  let sublist = null;
  let expandListButton = null;

  if (subtasks.length > 0) {
    const completedCount = subtasks.filter((task) => task.isCompleted).length;
    const totalCount = subtasks.length;
    const subtasksList = subtasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });

    secondaryText = `${completedCount}/${totalCount} subtasks completed`;

    sublist = (
      <Collapse
        className={classes.sublist}
        in={sublistOpen}
        timeout="auto"
        unmountOnExit
      >
        <List>{subtasksList}</List>
        <AddTask parentId={id} />
      </Collapse>
    );

    expandListButton = (
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => setSublistOpen((open) => !open)}
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
            onChange={({ target }) =>
              setTaskCompleted({ id, isCompleted: target.checked })
            }
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
      <DeleteDialog ref={deleteDialog} onConfirm={() => removeTask(id)} />
      {sublist}
    </div>
  );
};

export default Task;
