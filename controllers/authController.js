const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors");
const sendToken = require("../utils/jwtToken");

const register = async (req, res) => {
	const { name, email, avatar, password } = req.body;

	if (!(name && email && avatar && password)) {
		throw new BadRequestError("Please provide all values");
	}

	const userCount = await User.countDocuments();
	let role = "";
	if (userCount === 0) {
		role = "admin";
	} else {
		role = "user";
	}
	const user = await User.create({ name, email, avatar, password, role });
	sendToken(user, StatusCodes.CREATED, res);
};

const login = async(req, res) => {
    const { email, password } = req.body

    if(!(email && password)) {
        throw new BadRequestError("Please provide email and password")
    }

    const user = await User.findOne({email}).select("+password")

    if(!user) {
        throw new UnauthenticatedError("Invalid credential")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials")
    }

    sendToken(user, StatusCodes.OK, res)
}

const logout = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(StatusCodes.OK).json({success: true, msg: "Logged out"})
}

module.exports = {
	register,
    login,
    logout
};
