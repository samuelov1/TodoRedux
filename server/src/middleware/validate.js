import ValidationError from "../errors/ValidationError";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req);
  if (error) {
    throw new ValidationError(
      `${error.details.map((x) => x.message).join(", ")}`
    );
  } else {
    req.body = value.body;
    req.params = value.params;
    next();
  }
};
