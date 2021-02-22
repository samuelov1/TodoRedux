export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode);
  res.send({ status: "error", message: err.message });
};
