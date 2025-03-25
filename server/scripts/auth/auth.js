import { fastify } from '../../server.js';
import { fileURLToPath } from 'url';
import fastifyFormbody from '@fastify/formbody';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import fs from 'fs';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

dotenv.config({ path: __dirname+ './../../.env'});

console.log(process.env.JWT_SECRET)

fastify.register(fastifyFormbody);

fastify.register(jwt, {
		secret: process.env.JWT_SECRET
	});

fastify.register(cookie, {
		secret: process.env.COOKIE_SECRET,
		hook: 'onRequest',
		parseOptions: {}
	});

fastify.get('/sign-up', async function (request, reply) {  

	const token = request.cookies.token;
	if (!token)
		return reply.sendFile('sign-up.html');
	else
		return reply.send("You are already authentificated.");	
});

fastify.post('/sign-up', async function (request, reply) {

	const { email, password, cpassword } = request.body;

	// const errEmail = validateEmail(email);
	// if (errEmail)
	// {
	// 	error("Invalid email");
	// 	return reply.redirect('signup');
	// }

	// const errPassword = validatePassword(password, cpassword)
	// if (errPassword)
	// {
	//	 errPassword.forEach(element => {
	//		 error(element);
	//	 });
	//	 return reply.redirect('signup');
	// }

	let hash;

	try {
		hash = await argon2.hash(password);
	} catch (err) {
		error(`An error occured while registering a password: ${err}`);
	}

	const userData = { email, hash };

	try {
        let users = [];
        if (fs.existsSync("users.json")) {
            const data = fs.readFileSync("users.json", "utf-8");
            if (data) users = JSON.parse(data);
        }

        if (users.some(user => user.email === email)) {
            error("Email already in use");
            return reply.redirect('signup');
        }

        users.push(userData);
        await fs.promises.writeFile("users.json", JSON.stringify(users, null, 2));

        console.log("\x1b[32mCreating token\x1b[0m");
        const token = fastify.jwt.sign({ email });

        return reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 3600
        }).redirect('html');

    } catch (err) {
        error(`An error occurred: ${err}`);
        return reply.redirect('signup');
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

function error(message)
{
	console.log(`\x1b[31m${message}\x1b[0m`);
}

function generateToken(name)
{

}