import {
  findAllTasks,
  findById,
  setCompletedAndUpdateAncestor,
  deleteTaskAndUpdateAncestor
} from "../utils/taskUtils";

export const getAllTasks = (req, res, next) => {
  findAllTasks()
    .then((results) => res.send(results))
    .catch(next);
};

export const getById = (req, res, next) => {
  const id = req.params.id;

  findById(id)
    .then((result) => res.send(result))
    .catch(next);
};

export const setCompletedById = (req, res, next) => {
  const id = req.params.id;
  const isCompleted = req.body.isCompleted;

  setCompletedAndUpdateAncestor(id, isCompleted)
    .then((result) => res.send(result))
    .catch(next);
};

export const deleteById = (req, res, next) => {
  const id = req.params.id;

  deleteTaskAndUpdateAncestor(id)
    .then((result) => res.send(result))
    .catch(next);
};
