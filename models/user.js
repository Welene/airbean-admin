import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		minlength: 5,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	role: {
		type: String,
		required: true, // alle nye brukere MÅ ha en rolle
		enum: ['guest', 'user', 'admin'], // disse tre skal være med i header der tokenet er, de får da en av disse rollene
		default: 'user',
	},
});

const User = mongoose.model('User', userSchema);

export default User;
