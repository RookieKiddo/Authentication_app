const {
    restart
} = require('nodemon');
const crypto = require('crypto');
const Users = require('../models/Users.js');
const ErrorReponse = require('../utils/errorResponse.js');
const sendEmail = require('../utils/sendEmail.js');

exports.register = async (req, res, next) => {
    const {
        userName,
        email,
        password
    } = req.body;
    try {
        const user = await Users.create({
            userName,
            email,
            password
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return next(new ErrorReponse("Please provide an email and password"), 400);
    }

    try {
        const user = await Users.findOne({
            email
        }).select("+password");

        if (!user) {
            return next(new ErrorReponse("Invalid Credentials"), 401);
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorReponse("Invalid Credentials"), 401);
        }

        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            sucess: false,
            error: error.message
        })
    }
};

exports.forgetpassword = async (req, res, next) => {
    const {
        email
    } = req.body;

    try {
        const user = await Users.findOne({
            email
        });

        if (!user) {
            return next(new ErrorReponse("Email could not be sent"), 404);
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
        const message = `
        <h1> You have requested a new password reset </h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off> ${resetUrl}</a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });

            res.status(200).json({
                sucess: true,
                data: "Email Sent"
            })
        } catch (error) {
            user.getResetPasswordToken = undefined;
            user.getResetPasswordExpire = undefined;

            await user.save();
            return next(new ErrorReponse("Email Could Not Be Send"), 500)

        }
    } catch (error) {
        next(error);
    }
};

exports.resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await Users.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now()
            }
        })

        if (!user) {
            return next(new ErrorReponse("Invalid Reset Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            data: "Password Reset Success"
        });
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        sucess: true,
        token
    });
}