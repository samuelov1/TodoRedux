import React from "react";
import { List } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useFilteredTasks } from "../hooks/tasks";
import Task from "./Task";

const TaskList = () => {
  const { isLoading, isError, tasks } = useFilteredTasks();

  if (isError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Tasks Could not be loaded. <strong>Refresh to try again</strong>
      </Alert>
    );
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  const taskList = tasks.map((task) => {
    return <Task key={task._id} task={task} />;
  });

  return <List>{taskList}</List>;
};

export default TaskList;
