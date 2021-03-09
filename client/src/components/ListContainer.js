import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Container } from "@material-ui/core";

import ListHeader from "./ListHeader";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import ListSortingPanel from "./ListSortingPanel";
import FilterProvider from "./providers/FilterProvider";

const useStyle = makeStyles({
  container: {
    marginTop: 60
  }
});

const ListContainer = () => {
  const classes = useStyle();

  return (
    <Container className={classes.container} maxWidth="md">
      <FilterProvider>
        <ListHeader />
        <ListSortingPanel />
        <TaskList />
      </FilterProvider>
      <AddTask />
    </Container>
  );
};

export default ListContainer;
