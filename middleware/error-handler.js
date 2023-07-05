const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
	const customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong try again"
	};

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(`, `);
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}
	if (err.code && err.code === 11000) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, Please choose another value`;
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}
	// if (err.name === "CastError") {
    //     customError.msg = `No items found with the id ${err.value}`
    //     customError.statusCode = StatusCodes.BAD_REQUEST
	// }

	res.status(customError.statusCode).json({success: false, msg: customError.msg})
	// res.status(customError.statusCode).json({ success: false, err });
};

module.exports = errorHandler;
