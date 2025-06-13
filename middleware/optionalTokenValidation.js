import jwt from 'jsonwebtoken';

// function that makes it possible to swap out global.user with req.user in checkIfLoggedIn middleware
const jwtSecret = 'detteerenlangstreng123veldigvanskelig456';

export default function optionalTokenValidation(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	// hvis token ikke finnes (guest) -- fortsetter med next()
	// AKA guests kan bruke /register
	if (token == null) {
		return next();
	}

	// hvis man har en token - valider det
	jwt.verify(token, jwtSecret, (err, user) => {
		if (err) {
			// user with invalid token? CAN'T USE /REGISTER
			return next({
				status: 403,
				message: 'Invalid or expired token. Log in again.',
			});
		}
		// gyldig token === info legges til i req.user --> sånn at man kan bruke req.user i checkIfLoggedIn i stedet for global.user!
		req.user = user;
		next(); // Fortsett til neste middleware/rutehåndterer
	});
}
