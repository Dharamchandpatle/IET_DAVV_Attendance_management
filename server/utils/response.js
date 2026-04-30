const sendResponse = (res, { success, message, data, status }) => {
  return res.status(status).json({
    success,
    message,
    data: data ?? null
  });
};

const sendSuccess = (res, message, data = null, status = 200) => {
  return sendResponse(res, { success: true, message, data, status });
};

const sendError = (res, message, status = 400, data = null) => {
  return sendResponse(res, { success: false, message, data, status });
};

module.exports = {
  sendSuccess,
  sendError
};
