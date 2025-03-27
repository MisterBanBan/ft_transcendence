import { fastify } from '../../server.js';
import { error } from './error.js';
import fs from 'fs';
import argon2 from 'argon2';

fastify.get('/sign-up', async function (request, reply) {

	const token = request.cookies.token;
	if (!token)
		return reply.sendFile('sign-up.html');
	else
		return reply.send("You are already authentificated.");
});

fastify.post('/sign-up', async function (request, reply) {

	const { email, password, cpassword } = request.body;

	const errEmail = validateEmail(email);
	if (errEmail) {
		error("Invalid email");
		return reply.redirect('sign-up');
	}

	// const errPassword = validatePassword(password, cpassword)
	// if (errPassword) {
	// 	errPassword.forEach(element => {
	// 		error(element);
	// 	});
	// 	return reply.redirect('sign-up');
	// }

	let hash;

	try {
		hash = await argon2.hash(password);
	} catch (err) {
		error(`An error occured while registering a password: ${err}`);
	}

	try {
		let users = [];
		if (fs.existsSync("users.json")) {
			const data = fs.readFileSync("users.json", "utf-8");
			if (data) users = JSON.parse(data);
		}

		if (users.some(user => user.email === email)) {
			error("Email already in use");
			return reply.redirect('sign-up');
		}

		console.log("\x1b[32mCreating token\x1b[0m");
		const token = fastify.jwt.sign({ email });

		const userData = { email, hash, token };

		users.push(userData);
		await fs.promises.writeFile("users.json", JSON.stringify(users, null, 2));

		return reply.setCookie('token', token, {
			path: '/',
			httpOnly: true,
			secure: false,
			maxAge: 3600
		}).redirect('html');

	} catch (err) {
		error(`An error occurred: ${err}`);
		return reply.redirect('sign-up');
	}
});

function validateEmail(email) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return !emailRegex.test(email);
}

function validatePassword(password, cpassword) {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	const isLongEnough = password.length >= minLength;
	const samePassword = password === cpassword

	if (isLongEnough && hasUpperCase && hasNumber && hasSpecialChar && samePassword) {
		return false;
	}

	const errors = [];
	if (!isLongEnough) errors.push("The password needs at least 8 characters.");
	if (!hasUpperCase) errors.push("The password needs at least 1 upper case.");
	if (!hasNumber) errors.push("The password needs at least 1 number.");
	if (!hasSpecialChar) errors.push("The password needs at least 1 special character.");

	return errors;
}
