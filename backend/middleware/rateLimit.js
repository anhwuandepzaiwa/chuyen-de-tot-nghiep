const rateLimit = require('express-rate-limit');

const signUpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: "Quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau 15 phút.",
});

module.exports = signUpLimiter;

