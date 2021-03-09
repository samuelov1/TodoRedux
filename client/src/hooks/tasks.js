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
import { useErrors } from "../components/providers/ErrorProvider";

const queryName = "tasks";

export const useTasks = () =>
  useQuery("tasks", fetchAllTasks, {
    refetchOnWindowFocus: false
  });

const filterTasks = (
  tasks,
  selectedSortingOption,
  showCompleted,
  isReversed
) => {
  if (!tasks || tasks.length === 0) return [];

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
  optimisticUpdateFn,
  refretchOnSuccess = false
) => {
  const { addError } = useErrors();

  return useMutation(mutateFn, {
    onMutate: async (args) => {
      await queryClient.cancelQueries(queryName);

      const previousValue = queryClient.getQueryData(queryName);

      queryClient.setQueryData(queryName, (prevTasks) =>
        optimisticUpdateFn(prevTasks, args)
      );

      return previousValue;
    },
    onSuccess: () => {
      if (refretchOnSuccess) {
        queryClient.invalidateQueries(queryName);
      }
    },
    onError: ({ response }, variables, previousValue) => {
      addError(response.statusText, response.status);
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
  const refetchOnSuccess = true;
  return createOptimisticMutation(
    queryClient,
    queryName,
    addTask,
    optimisticAddTask,
    refetchOnSuccess
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
