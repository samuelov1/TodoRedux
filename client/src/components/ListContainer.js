import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { connect } from "react-redux";
import { getFilteredTasks } from "../redux/selectors/tasks";
import ListHeader from "./ListHeader";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import ListSortingPanel from "./ListSortingPanel";

const useStyle = makeStyles({
  container: {
    marginTop: 60
  }
});

const ListContainer = ({ tasks }) => {
  const classes = useStyle();
  return (
    <Container className={classes.container} maxWidth="md">
      <ListHeader />
      <ListSortingPanel />
      <TaskList tasks={tasks} />
      <AddTask />
    </Container>
  );
};

const mapStateToProps = state => {
  const tasks = getFilteredTasks(state);
  return { tasks };
};

export default connect(mapStateToProps)(ListContainer);
