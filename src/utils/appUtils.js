exports.responseUtil = (err, response = null) => {
  if (response?.pass) {
    response.pass = undefined;
  }
  return {
    err: err ? exports.errorHandler(err) : null,
    response: response,
  };
};

exports.errorHandler = (error) => {
  if (process.env.ENV_MODE === "DEVELOPMENT" && error) {
    console.log(error);
  }

  if (!error) return null;

  if (error.name === "ValidationError") {
    const errors = {};
    for (let err in error.errors) {
      errors[err] = error?.errors[err].message;
    }
    return errors;
  } else if (error.code === 11000) {
    return Object.keys(error.keyValue)[0] + " already exists.";
  } else if (error.message) {
    return error.message;
  }
  return "Internal server error";
};

exports.statusCode = (error) => {
  if (!error) return 200;
  if (error === 201) return 201;
  if (error.name === "ValidationError" || error.code === 11000 || error.badReq)
    return 400;
  if (error.notFound) return 404;
  return 500;
};
