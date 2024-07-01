const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    console.log(error)
    res.json({
        error: error.message,
        stack: error.stack,
    });
    next();
};

module.exports = errorHandler;