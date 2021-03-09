import React, { useState } from "react";
import { Icon, Box, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

import TaskForm from "./TaskForm";
import { useQueryClient } from "react-query";
import { useAddTaskMutation } from "../hooks/tasks";

const useStyle = makeStyles({
  root: {
    padding: "3px 0px",
    display: "flex"
  },
  addIcon: {
    margin: "0px 23px 0 9px"
  },
  placeholder: {
    lineHeight: "35px"
  }
});

const AddTask = ({ parentId }) => {
  const classes = useStyle();
  const queryClient = useQueryClient();
  const [isEnabled, setIsEnabled] = useState(false);
  const { mutate: addTask } = useAddTaskMutation(queryClient);

  const closeForm = (e) => {
    e.stopPropagation();
    setIsEnabled(false);
  };

  const handleSubmit = (task) => {
    parentId ? addTask({ ...task, parentId }) : addTask(task);
  };

  const placeholder = (
    <Typography className={classes.placeholder} color="textSecondary">
      Add Task...
    </Typography>
  );

  return (
    <Box
      display="flex"
      className={classes.root}
      onClick={() => setIsEnabled(true)}
    >
      <Icon color="secondary" className={classes.addIcon}>
        <Add />
      </Icon>
      {isEnabled ? (
        <TaskForm onSubmit={handleSubmit} onCancel={closeForm} />
      ) : (
        placeholder
      )}
    </Box>
  );
};

export default AddTask;
