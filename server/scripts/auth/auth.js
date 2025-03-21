import { fastify } from '../../server.js';
import fastifyFormbody from '@fastify/formbody';
import fs from 'fs'
import argon2 from 'argon2'

fastify.register(fastifyFormbody);

fastify.get('/signup', async function (request, reply) {  
    return reply.sendFile('signup.html');
});

fastify.post('/signup', async function (request, reply) {

    const { email, password, cpassword } = request.body;

    const errEmail = validateEmail(email);
    if (errEmail)
    {
		error("Invalid email");
        return reply.redirect('signup');
    }

    const errPassword = validatePassword(password, cpassword)
    if (errPassword)
    {
        errPassword.forEach(element => {
            error(element);
        });
        return reply.redirect('signup');
    }

	let hash;
	try {
		hash = await argon2.hash(password);
	} catch (err) {
		error(`An error occured while registering a password: ${err}`);
	}

	const userData = { email, hash };

    fs.readFile("users.json", "utf-8", (err, data) => {
        let users = [];
        if (!err && data) {
            users = JSON.parse(data);
        }

        if (users.some(user => user.email === email)) {
            error("Email already in use");
            return reply.redirect('signup');
        }

        users.push(userData);

        fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
            if (err)
                error(`An error occurred while registering an user: ${err}`);
            else
                console.log("Correctly registered: ", email);
        });
    });

    return reply.redirect('signup');
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