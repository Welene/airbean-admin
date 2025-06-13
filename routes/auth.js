import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { findUser, registerUser } from '../services/usersServices.js';
import { validateAuthBody } from '../middleware/validateAuthBody.js';
import { checkIfLoggedIn } from '../middleware/checkIfLoggedIn.js';
import optionalTokenValidation from '../middleware/optionalTokenValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// REGISTER
router.post(
	'/register',
	optionalTokenValidation,
	checkIfLoggedIn,
	validateAuthBody,
	async (req, res, next) => {
		const { username, password, role } = req.body;

		// krypterer passord FØR vi sender inn username & password
		const hashedPassword = await bcrypt.hash(password, 10);

		let newUserIdPrefix = 'user'; // default user i modellen === 'user' --> default id starts with 'user' too
		if (role === 'admin') {
			newUserIdPrefix = 'admin'; // changes prefix in the id if role is not 'user' (or guest...)
		}
		const newUserId = `${newUserIdPrefix}-${uuid().substring(0, 5)}`; // saving the prefix (user, guest, admin to a variable, that we use down below in userId)

		try {
			const result = await registerUser({
				username,
				password: hashedPassword,
				userId: newUserId,
				role: role,
			});

			res.status(201).json({
				success: true,
				message: 'User created successfully',
				userId: result.userId,
			});
		} catch (error) {
			next(error);
		}
	}
);

// LOGIN
router.post('/login', validateAuthBody, async (req, res, next) => {
	const { username, password, role } = req.body; // henter ut username & passwprd

	const user = await findUser(username);

	if (user) {
		// om brukeren finnes..
		const checkIfPasswordsMatch = await bcrypt.compare(
			password,
			user.password
		);
		if (checkIfPasswordsMatch) {
			const token = jwt.sign(
				{
					userId: user.userId,
					username: user.username,
					role: user.role,
				}, // user.role er det jeg nettopp la til user.js MODELLEN
				'detteerenlangstreng123veldigvanskelig456',
				{ expiresIn: 60 * 60 } // 10 min was way too annoying!!
			);

			return res.json({
				success: true,
				message: 'User logged in successfully',
				token: `Bearer ${token}`, // sender vårt token tilbake + ordet Bearer for some reason
			});
		} else {
			return next({
				status: 400,
				message: 'Username or password are incorrect',
			});
		}
	} else {
		return next({
			status: 400,
			message: 'Username or password are incorrect',
		});
	}
});

// LOGOUT
router.get('/logout', (req, res) => {
	res.json({
		success: true,
		message: 'User logged out successfully',
	});
});

export default router;
