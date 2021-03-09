import { useMemo } from "react";
import { useQuery, useMutation } from "react-query";
import {
  optimisticSetCompletedById,
  optimisticAddTask,
  optimisticRemoveTask,
  optimisticUpdateTask
} from "./optimisticMutations";
import {
  fetchAllTasks,
  setCompletedById,
  addTask,
  removeTask,
  updateTask
} from "../api/tasks";
import { useFilterState } from "../components/providers/FilterProvider";

const queryName = "tasks";

export const useTasks = () =>
  useQuery("tasks", fetchAllTasks, {
    refetchOnWindowFocus: false,
    initialData: []
  });

const filterTasks = (
  tasks,
  selectedSortingOption,
  showCompleted,
  isReversed
) => {
  const filter = (task) => showCompleted || !task.isCompleted;
  const sort = selectedSortingOption
    ? selectedSortingOption.sortFunction
    : () => true;

  const filteredTasks = tasks
    .filter(filter)
    .sort(sort)
    .map((task) => {
      const filteredSubtasks = filterTasks(
        task.subtasks,
        selectedSortingOption,
        showCompleted,
        isReversed
      );
      return { ...task, subtasks: filteredSubtasks };
    });

  return isReversed ? filteredTasks.reverse() : filteredTasks;
};

export const useFilteredTasks = () => {
  const { selectedSortingOption, isReversed, showCompleted } = useFilterState();
  const { isLoading, isError, data } = useTasks();

  const filteredTasks = useMemo(
    () => filterTasks(data, selectedSortingOption, showCompleted, isReversed),
    [data, selectedSortingOption, isReversed, showCompleted]
  );

  return { isLoading, isError, tasks: filteredTasks };
};

const createOptimisticMutation = (
  queryClient,
  queryName,
  mutateFn,
  optimisticUpdateFn
) => {
  return useMutation(mutateFn, {
    onMutate: async (args) => {
      await queryClient.cancelQueries(queryName);

      const previousValue = queryClient.getQueryData(queryName);

      queryClient.setQueryData(queryName, (prevTasks) =>
        optimisticUpdateFn(prevTasks, args)
      );

      return previousValue;
    },
    onError: (err, variables, previousValue) => {
      queryClient.setQueryData(queryName, previousValue);
    }
  });
};

export const useSetCompletedMutation = (queryClient) => {
  return createOptimisticMutation(
    queryClient,
    queryName,
    setCompletedById,
    optimisticSetCompletedById
  );
};

export const useAddTaskMutation = (queryClient) => {
  return createOptimisticMutation(
    queryClient,
    queryName,
    addTask,
    optimisticAddTask
  );
};

export const useRemoveTaskMutation = (queryClient) => {
  return createOptimisticMutation(
    queryClient,
    queryName,
    removeTask,
    optimisticRemoveTask
  );
};

export const useUpdateTaskMutation = (queryClient) => {
  return createOptimisticMutation(
    queryClient,
    queryName,
    updateTask,
    optimisticUpdateTask
  );
};
