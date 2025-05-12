export const errorHandler = (statusCode, message) => {
  console.log("inside error handler");
  return { statusCode: statusCode, message };
};
