const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = CustomAPIError