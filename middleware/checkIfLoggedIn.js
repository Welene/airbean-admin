// om inloggad måste man logga ut innan man kan skapa nytt konto igen
export function checkIfLoggedIn(req, res, next) {
	if (req.user) {
		// can use req.user to check user object instead of using global.user! --> because of the optionalTokenValidator middleware
		return next({
			status: 400,
			message:
				'User already logged in - you need to log out first, before you can register',
		});
	}
	next();
}
