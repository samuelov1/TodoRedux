export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req);
  if (error) {
    res
      .status(422)
      .send(
        `Validation error: ${error.details.map((x) => x.message).join(", ")}`
      );
  } else {
    req.body = value.body;
    req.params = value.params;
    next();
  }
};
