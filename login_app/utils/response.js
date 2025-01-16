module.exports.successResponse = (statusCode, data) => {
    return {
      statusCode,
      body: JSON.stringify(data),
    };
  };
  
module.exports.errorResponse = (statusCode, message) => {
    return {
        statusCode,
        body: JSON.stringify({ error: message }),
    };
};