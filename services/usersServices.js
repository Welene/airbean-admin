import User from '../models/user.js';

export async function registerUser(user) {
	console.log('usersServices.js: Received in registerUser:', user);
	try {
		const result = await User.create(user);
		console.log('usersServices.js: Created user result:', result);
		return result;
	} catch (error) {
		if (error.code === 11000) {
			// 11000 - duplicate key error AKA already exists
			throw {
				status: 400,
				message: 'Username already exists. Please choose another.',
			};
		}
		throw {
			status: 500,
			message: 'User could not be created',
		};
	}
}

export async function findUser(username) {
	try {
		const user = await User.findOne({ username: username });
		if (user) return user;
		else throw new Error('No user found');
	} catch (error) {
		console.log(error.message);
		return null;
	}
}
