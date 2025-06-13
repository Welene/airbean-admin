import bcrypt from 'bcrypt';
// function/script that generates ONE hased password for my ONE admin user
// put all that shait manually into mongodb into the collection: users - now there is an admin user voilá !
// EDIT: only needed in the beginning not anymore but I'll keep it anyway because why not

const adminPassword = 'Iamthebestadminever123';

const hashingRounds = 10;

bcrypt
	.hash(adminPassword, hashingRounds)
	.then((hashedPassword) => {
		console.log('Original pssword:', adminPassword);
		console.log('Hashed the Admin password:', hashedPassword);
	})
	.catch((error) => {
		console.error('Could not hash the password:', error);
	});

// login: MySuperSecurePassword123 is written in Insomnia body
// That password is being sent to the code that hashes the password in login route
// uses .compare to see if they match
// if match === gets a token --> with role: "admin"
// token is being sent back to Insomnia - and you can login as ADMIN role
// with this admin token, I can then change menu and stuff as long as middleware checks are passed

// in the terminal --- ran this for hashed password for admin:
// utils/hashedPasswordAdmin.js
// logs out my password...: Iamthebestadminever123
// and the hashed password...: $2b$10$sUG03vtb0eKJxUCpPMc76emGux.0QoCE81ee/z8WtVvnrT6KWt1P6
// copied hashed password into new user document on mongodb and created userId "admin-blabla" manually
