import jwt from 'jsonwebtoken';

// middleware som sjekker om man har admin som rolle
export default function checkAdmin(req, res, next) {
	console.log(req.user);
	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		res.status(403).json({
			success: false,
			message:
				'YOU SHALL NOT PASS! (admin token required to get to this route)',
		});
	}
}
