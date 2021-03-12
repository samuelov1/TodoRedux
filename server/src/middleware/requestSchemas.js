import joi from "joi";

export const idSchema = joi
  .object()
  .keys({
    params: joi.object({
      id: joi
        .string()
        .alphanum()
        .required()
    })
  })
  .unknown(true);

export const setCompletedSchema = joi
  .object()
  .keys({
    params: joi.object({
      id: joi
        .string()
        .alphanum()
        .required()
    }),
    body: joi.object({
      isCompleted: joi.boolean().required()
    })
  })
  .unknown(true);

export const taskSchema = joi
  .object()
  .keys({
    body: joi.object({
      content: joi.string().required(),
      isCompleted: joi.boolean().default(false),
      parentId: joi.string(),
      subtasks: joi.array().default([])
    })
  })
  .unknown(true);

export const updateTaskSchema = joi
  .object()
  .keys({
    body: joi.object({
      _id: joi
        .string()
        .alphanum()
        .required(),
      content: joi.string().required(),
      isCompleted: joi.boolean().required(),
      parentId: joi.string(),
      subtasks: joi.array().required()
    })
  })
  .unknown(true);
