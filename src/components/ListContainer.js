import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import ListHeader from "./ListHeader";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import ListSortingPanel from "./ListSortingPanel";

const useStyle = makeStyles({
  container: {
    marginTop: 60
  }
});

const ListContainer = () => {
  const classes = useStyle();
  return (
    <Container className={classes.container} maxWidth="md">
      <ListHeader />
      <ListSortingPanel />
      <TaskList />
      <AddTask />
    </Container>
  );
};

export default ListContainer;
