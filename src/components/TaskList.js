import React from "react";
import { connect } from "react-redux";
import { getAllTasks } from "../redux/selectors";
import { List } from "@material-ui/core";

import Task from "./Task";

const TaskList = ({ tasks }) => {
  const taskList = tasks.map(task => {
    return <Task key={task.id} task={task} />;
  });

  return <List>{taskList}</List>;
};

const mapStateToProps = state => {
  const tasks = getAllTasks(state);
  return { tasks };
};

export default connect(mapStateToProps)(TaskList);
