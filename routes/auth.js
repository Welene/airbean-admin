import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { findUser, registerUser } from '../services/usersServices.js';
import { validateAuthBody } from '../middleware/validateAuthBody.js';
import { checkIfLoggedIn } from '../middleware/checkIfLoggedIn.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// REGISTER
router.post(
	'/register',
	checkIfLoggedIn,
	validateAuthBody,
	async (req, res, next) => {
		const { username, password } = req.body;

		// krypterer passord FØR vi sender inn username & password
		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			const result = await registerUser({
				username,
				password: hashedPassword, // her har vi sagt at passord er altså det samme som hashedPassword -- that's it!
				// teste det --> registrere ny bruker --> sjekke  mongodb database collection "users" --> se at passordet er kryptert
				userId: `user-${uuid().substring(0, 5)}`,
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
	const { username, password } = req.body; // henter ut username & passwprd

	const user = await findUser(username);

	if (user) {
		// om brukeren finnes..
		const checkIfPasswordsMatch = await bcrypt.compare(
			password,
			user.password
		); // sjekker om passordet våres matcher databasepassordet (det krypterte)
		// if (user.password === password) {
		// 1. password = kryptert passord i databasen // 2. password = det passordet vi skrev inn når vi registrerte oss
		// disse to er jo ulike siden det er kryptert, så rett før lager vi en const som venter på bcrypt.compare som sjekker det for oss
		// bytter ut med consten vi lagde, så OM DE MATCHER så: ---
		if (checkIfPasswordsMatch) {
			// PASSORDENE ER DE SAMME -- CHECK
			// VI HAR LOGGET INN -- CHECK

			// NÅ MÅ VI HA EN TOKEN
			const token = jwt.sign(
				{
					userId: user.userId,
					username: user.username,
					role: user.role,
				}, // user.role er det jeg nettopp la til user.js MODELLEN
				'detteerenlangstreng123veldigvanskelig456', // LEGG DEN HELLER I env FILEN SÅNN AT DEN IKKE PUSHES OPP -- men eksamen nå så den bør kanskje ligge her for now...
				{ expiresIn: 60 * 10 } // 10 min
			);
			// SIGNERER en token til brukeren
			// tar imot: 1) payload AKA data som vi skal ha i tokenet (userId, roller f.eks), 2) en hemmelig streng som vi skal bruke når man dekrypterer tokenet -
			// strengen hjelper til å både kryptere/dekryptere vårt token. 3) objekt med options  til anropet om man vil {expiresIn: angir hvor lang tid tokenet er aktivt}
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
	global.user = null;
	res.json({
		success: true,
		message: 'User logged out successfully',
	});
});

export default router;
