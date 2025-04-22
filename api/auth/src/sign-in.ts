import {server} from './index.js';
import fs from 'fs';
import argon2 from 'argon2';
import * as repl from "node:repl";

interface User {
	email: string;
	hash: string;
	token: string;
}

interface Cookie {
	path: string,
	httpOnly: boolean,
	secure: boolean,
	maxAge: number
}

server.get('/api/auth/sign-in', async function (request, reply) {

	console.log("GET /api/auth/sign-in");

	const token = request.cookies.token
	if (token) {
		reply.redirect("/");
	}

	const htmlContent = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Sign-in</title>
		<style>

			body {
				background-color: rgb(70, 70, 70);
				font-family: Arial, Helvetica, sans-serif;
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
	
			.error-message {
				color: red;
				font-size: 15px;
				padding-bottom: 5px;
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
		</style>
	</head>

	<body>
		<form action="" method="post">
		
		<div class="error-message" id="error-global-signin"></div>
		
		<label for="email">Email:</label>
		<div class="error-message" id="error-email-signin"></div>
		<input type="text" name="email" id="email-signin">
		
		<label for="password">Password:</label>
		<div class="error-message" id="error-password-signin"></div>
		<input type="password" name="password" id="password-signin">
		
		<input type="button" id="submit-signin" value="Sign in">
		</form>
		
		<script type="module" src="/public/auth/sign-in.js"></script>
	</body>

	</html>`

	reply.type('text/html').send(htmlContent);
});

server.post('/api/auth/sign-in', async function (request, reply) {

	console.log("POST /api/auth/sign-in");
	const {email, password} = request.body as { email: string; password: string };

	try {

		let users: User[] = [];
		if (fs.existsSync("users.json")) {
			const data = fs.readFileSync("users.json", "utf-8");
			if (data) users = JSON.parse(data);
		} else
			return reply.status(400).send({error: ["No users.json file found"], type: "global"});

		let token;

		const user = users.find((user: User) => user.email === email);
		if (user)
			token = user.token;
		else {
			return reply.status(400).send({error: ["Invalid email."], type: "email"});
		}

		console.log("Find user:", user);

		const cookie = { path: '/',
			httpOnly: true,
			secure: false,
			maxAge: 3600 } as Cookie;

		if (await argon2.verify(user.hash, password)) {
			return reply.setCookie('token', token, cookie).status(200).send({ error: [`Successfully registered`], type: "global" });
		} else
			return reply.status(400).send({error: ["Invalid password."], type: "password"});
	} catch (err) {
		return reply.status(400).send({error: [err], type: "global"});
	}
});