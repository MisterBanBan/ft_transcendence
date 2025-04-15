import argon2 from "argon2";
import fs from "fs";
import {server} from "./index.js";

interface User {
	email: string;
	hash: string;
	token: string;
}

server.get('/api/authentication/', async (request, reply) => {

	console.log("GET /api/authentication/");

	const htmlContent = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Sign-up</title>
		<style>
			body {
				background-color: rgb(70, 70, 70);
			}
			label {
				color: white;
			}
			form {
				display: flex;
				flex-direction: column;
				width: 300px;
				margin: 50px auto;
				padding: 20px;
				border: 1px solid #303030;
				border-radius: 8px;
				background: #3b3b3b;
			}
			label, input {
				margin-bottom: 10px;
			}
			input[type="text"],
			input[type="password"] {
				padding: 8px;
				border: 1px solid #ccc;
				border-radius: 4px;
			}
			input[type="button"] {
				background-color: #007BFF;
				color: white;
				border: none;
				padding: 10px;
				cursor: pointer;
				border-radius: 4px;
			}
			input[type="submit"]:hover {
				background-color: #0056b3;
			}
			.error-message {
				color: red;
				font-size: 15px;
				padding-bottom: 5px;
			}
		</style>
	</head>
	<body>
	<form id="signup-form" action="" method="post">
		<div class="error-message" id="error-global"></div>

		<label for="email">Email:</label>
		<div class="error-message" id="error-email"></div>
		<input type="text" name="email" id="email">

		<label for="password">Password:</label>
		<div class="error-message" id="error-password"></div>
		<input type="password" name="password" id="password">

		<label for="cpassword">Confirm password:</label>
		<input type="password" name="cpassword" id="cpassword">

		<input type="button" id="submit" value="Sign up">
	</form>

	<script type="module" src="/public/auth/sign-up.js"></script>
	</body>
	</html>
	`;

	// Répondre avec le contenu HTML
	reply.type('text/html').send(htmlContent);
});

server.post('/api/authentication/', async (request, reply) => {

	console.log("POST /api/authentication/");
	console.log(request.body);

	const { email, password, cpassword } = request.body as { email: string; password: string, cpassword: string };

	if (!email || !password || !cpassword) {
		return reply.status(400).send({ error: ['Tous les champs sont requis.'], type: 'global' });
	}

	const errEmail = validateEmail(email);
	if (errEmail)
		return reply.status(400).send({ error: ['Invalid email.'], type: "email" });

	const errPassword = validatePassword(password, cpassword)
	if (errPassword)
		return reply.status(400).send({ error: errPassword, type: "password" });

	let hash;

	try {
		hash = await argon2.hash(password);
	} catch (err) {
		return reply.status(400).send({ error: [`An error occurred while registering a password: ${err}.`], type: "password" });
	}

	try {
		let users: User[] = [];
		if (fs.existsSync("users.json")) {
			const data = fs.readFileSync("users.json", "utf-8");
			if (data) users = JSON.parse(data);
		}

		if (users.some((user: User) => user.email === email)) {
			return reply.status(400).send({ error: ["Email already in use."], type: "email" });
		}

		console.log("\x1b[32mCreating token\x1b[0m");
		const token = server.jwt.sign({ email });

		const userData = { email, hash, token };

		users.push(userData);
		await fs.promises.writeFile("users.json", JSON.stringify(users, null, 2));

		return reply.setCookie('token', token, {
			path: '/',
			httpOnly: true,
			secure: false,
			maxAge: 3600
		}).status(200).send({ error: [`Successfully registered`], type: "global" });

	} catch (err) {
		return reply.status(400).send({ error: [`An error occurred: ${err}.`], type: "global" });
	}
})

function validateEmail(email: string) {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return !emailRegex.test(email);
}

function validatePassword(password: string, cpassword: string) {
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
	if (!samePassword) errors.push("Passwords don't match.");

	return errors;
}
