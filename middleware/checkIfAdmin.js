import jwt from 'jsonwebtoken';

// middleware som sjekker om man har admin som rolle og om man er logget inn
export default function checkIfAdmin(req, res, next) {
	if (!req.user) {
		// checkIfAdmin forventer allerede at req-user er fylt ut - og her sjekkes det om den er tom/undefined først

		return next({
			status: 401,
			message: 'User is not logged in (need authentication).',
		});
	}

	if (req.user.role === 'admin') {
		next();
	} else {
		return next({
			status: 403,
			message:
				'You are authenticated (logged in) BUT you must be admin to do this',
		});
	}
}
