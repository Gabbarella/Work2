const rateLimit = require('express-rate-limit');
const { ViolationTypes } = require('librechat-data-provider');
const logViolation = require('~/cache/logViolation');

const getTransferEnvironmentVariables = () => {
  const TRANSFER_IP_MAX = parseInt(process.env.TRANSFER_IP_MAX) || 100;
  const TRANSFER_IP_WINDOW = parseInt(process.env.TRANSFER_IP_WINDOW) || 15;
  const TRANSFER_USER_MAX = parseInt(process.env.TRANSFER_USER_MAX) || 50;
  const TRANSFER_USER_WINDOW = parseInt(process.env.TRANSFER_USER_WINDOW) || 15;

  const transferIpWindowMs = TRANSFER_IP_WINDOW * 60 * 1000;
  const transferIpMax = TRANSFER_IP_MAX;
  const transferIpWindowInMinutes = transferIpWindowMs / 60000;

  const transferUserWindowMs = TRANSFER_USER_WINDOW * 60 * 1000;
  const transferUserMax = TRANSFER_USER_MAX;
  const transferUserWindowInMinutes = transferUserWindowMs / 60000;

  return {
    transferIpWindowMs,
    transferIpMax,
    transferIpWindowInMinutes,
    transferUserWindowMs,
    transferUserMax,
    transferUserWindowInMinutes,
  };
};

const createTransferHandler = (ip = true) => {
  const { transferIpMax, transferIpWindowInMinutes, transferUserMax, transferUserWindowInMinutes } =
    getTransferEnvironmentVariables();

  return async (req, res) => {
    const type = ViolationTypes.FILE_TRANSFER_LIMIT;
    const errorMessage = {
      type,
      max: ip ? transferIpMax : transferUserMax,
      limiter: ip ? 'ip' : 'user',
      windowInMinutes: ip ? transferIpWindowInMinutes : transferUserWindowInMinutes,
    };

    await logViolation(req, res, type, errorMessage);
    res.status(429).json({ message: 'Too many data transfer requests. Try again later' });
  };
};

const createTransferLimiters = () => {
  const { transferIpWindowMs, transferIpMax, transferUserWindowMs, transferUserMax } =
    getTransferEnvironmentVariables();

  const transferIpLimiter = rateLimit({
    windowMs: transferIpWindowMs,
    max: transferIpMax,
    handler: createTransferHandler(),
  });

  const transferUserLimiter = rateLimit({
    windowMs: transferUserWindowMs,
    max: transferUserMax,
    handler: createTransferHandler(false),
    keyGenerator: function (req) {
      return req.user?.id; // Use the user ID or NULL if not available
    },
  });

  return { transferIpLimiter, transferUserLimiter };
};

module.exports = { createTransferLimiters };
