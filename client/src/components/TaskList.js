import React from "react";
import { List } from "@material-ui/core";

import Task from "./Task";

const TaskList = ({ tasks }) => {
  const taskList = tasks.map((task) => {
    return <Task key={task._id} task={task} />;
  });

  return <List>{taskList}</List>;
};

export default TaskList;
