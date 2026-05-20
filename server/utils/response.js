const sendResponse = (res, { success, message, data, status }) => {
  // Sends a consistent JSON response envelope.
  return res.status(status).json({
    success,
    message,
    data: data ?? null
  });
};

const sendSuccess = (res, message, data = null, status = 200) => {
  // Sends a success response with optional payload.
  return sendResponse(res, { success: true, message, data, status });
};

const sendError = (res, message, status = 400, data = null) => {
  // Sends an error response with a message.
  return sendResponse(res, { success: false, message, data, status });
};

module.exports = {
  sendSuccess,
  sendError
};
