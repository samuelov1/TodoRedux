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
