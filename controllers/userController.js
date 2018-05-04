import mongoose from "mongoose";
const User = mongoose.model("User");
import { comparePassword } from '../models/User';
import jwt from 'jsonwebtoken';

exports.signup = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (user.length >= 1) {
		return res.status(409).json({
			message: "Mail exists"
		});
	} else {
		const user = await new User(req.body).save();
		res.status(201).json({ status: true, message: 'Register Success!' });
	};
};

exports.deleteUser = async (req, res, next) => {
	await User.remove({ _id: req.params.userId });
	res.status(200).json({ status: true, message: `Succesfully deleted` });
};

exports.login = async (req, res, next) => {
	const user = await (User.findOne({ email: req.body.email }));
	if(user.length < 1) {
		return res.status(401).json({
			status: false,
			message: 'Auth failed'
		});
	}

	user.comparePassword(req.body.password, (err, isMatch) => {
		if(err) throw err;
		if(isMatch) {
			const token = jwt.sign({
					email: user.email,
					id: user._id
				},
				process.env.JWT_KEY,
				{
					expiresIn: "1h"
				}
				);
				return res.status(200).json({
					message: 'Auth success!',
					token: token
				});
		}
		res.status(401).json({
			message: 'Auth Failed'
		});
	});
};
