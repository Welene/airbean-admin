export function validateAuthBody(req, res, next) {
	const { username, password, role } = req.body;

	if (!username || !password) {
		return next({
			status: 400,
			message: 'Both username and password are required',
		});
	}

	// if sats that checks if you wrote in a role, and that if that role IS NOT either guest, user og admin it won't go further & stops here!
	if (role && !['guest', 'user', 'admin'].includes(role)) {
		return next({
			status: 400,
			message: 'You cannot be that role - choose guest, user or admin.',
		});
	}

	next();
}
