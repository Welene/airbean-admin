import jwt from 'jsonwebtoken';

const jwtSecret = 'detteerenlangstreng123veldigvanskelig456';

export default function authenticateToken(req, res, next) {
	// fetches "Authorization" with payload from header AKA gets the token
	const authHeader = req.headers['authorization'];

	const token = authHeader && authHeader.split(' ')[1]; // tar bort alle "bjørner" i tokenet :-D AKA BEARER

	// om ingen token finnes i headeren
	if (token == null) {
		return res
			.status(401)
			.json({ success: false, message: 'No token provided.' });
	}

	// checking if token is still active and valid
	jwt.verify(token, jwtSecret, (err, user) => {
		if (err) {
			return res.status(403).json({
				success: false,
				message: 'Token is not valid or is expired already.',
			});
		}
		// if token is valid === adds decoded payload (token) into req.user
		// req.user has === { userId, username, role } inside of it now
		req.user = user;
		next();
	});
}
