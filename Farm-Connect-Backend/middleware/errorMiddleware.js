export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
}

export function errorHandler(err, req, res, next) {

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  res.status(500).json({
    success: false,
    message: err.message,
  });
}