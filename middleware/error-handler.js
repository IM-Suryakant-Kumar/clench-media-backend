const { StatusCodes } = require("http-status-codes")

const errorHandler = async (err, req, res, next) => {
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong try again"
    }

    res.status(customError.statusCode).json({success: false, msg: customError.message})
}

module.exports = errorHandler