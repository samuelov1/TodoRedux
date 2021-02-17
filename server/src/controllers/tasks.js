import joi from "joi";

import {
  findAllTasks,
  findById,
  setCompletedAndUpdateAncestor
} from "../utils/taskUtils";

export const getAllTasks = (req, res) => {
  findAllTasks()
    .then((results) => res.send(results))
    .catch((error) => {
      res.status(500).send(error);
    });
};

export const getById = (req, res) => {
  const schema = joi.object().keys({
    id: joi
      .string()
      .alphanum()
      .required()
  });

  const error = schema.validate(req.params).error;
  if (error) {
    return res.status(422).send(error);
  }

  const id = req.params.id;

  findById(id)
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(404).send(error);
    });
};

export const setCompletedById = (req, res) => {
  const schema = joi.object().keys({
    id: joi
      .string()
      .alphanum()
      .required(),
    isCompleted: joi
      .string()
      .valid("true", "false")
      .required()
  });

  const error = schema.validate(req.params).error;
  if (error) {
    return res.status(422).send(error);
  }

  const id = req.params.id;
  const isCompleted = req.params.isCompleted === "true";

  setCompletedAndUpdateAncestor(id, isCompleted)
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(404).send(error);
    });
};
