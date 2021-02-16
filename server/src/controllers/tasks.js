import joi from "joi";

import { findAllTasks, findById } from "../utils/taskUtils";

export const getAllTasks = (req, res) => {
  findAllTasks()
    .then((results) => res.send(results))
    .catch((error) => {
      console.error(error);
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
      console.error(error);
      res.status(500).send(error);
    });
};
