import fastify from 'fastify';
import {loadModules} from "./plugins.js";

export const server = fastify();

server.get('/health', async (request, reply) => {
	reply.code(200).send({ status: 'healthy' });
});

server.get('/api/auth/', async (request, reply) => {

	console.log("GET /api/auth/");

	const htmlContent = `<!DOCTYPE html>
	<html lang="en">

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Sign-up and Sign-in</title>
		<style>
			body {
				background-color: rgb(70, 70, 70);
				font-family: Arial, Helvetica, sans-serif;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
				margin: 0;
			}

			.container {
				display: flex;
				width: 80%;
				max-width: 1200px;
				justify-content: space-between;
			}

			.form-container {
				display: flex;
				flex-direction: column;
				width: 45%;
				background-color: #3b3b3b;
				padding: 20px;
				border-radius: 8px;
				border: 1px solid #303030;
			}

			.form-container label {
				color: white;
			}

			.form-container input[type="text"],
			.form-container input[type="password"] {
				padding: 8px;
				border: 1px solid #ccc;
				border-radius: 4px;
				margin-bottom: 10px;
			}

			.form-container input[type="button"] {
				background-color: #007BFF;
				color: white;
				border: none;
				padding: 10px;
				cursor: pointer;
				border-radius: 4px;
			}

			.form-container input[type="submit"]:hover {
				background-color: #0056b3;
			}

			.form-container .error-message {
				color: red;
				font-size: 15px;
				padding-bottom: 5px;
			}
		</style>
	</head>

	<body>
		<div class="container">
			<!-- Sign-in Form -->
			<div class="form-container">
				<h2 style="color:white;">Sign In</h2>
				<div class="error-message" id="error-global-login"></div>
		
				<label for="email">Email:</label>
				<div class="error-message" id="error-email-login"></div>
				<input type="text" name="email" id="email-login">
		
				<label for="password">Password:</label>
				<div class="error-message" id="error-password-login"></div>
				<input type="password" name="password" id="password-login">
		
				<input type="button" id="submit-login" value="Sign In">
			</div>
	
			<!-- Sign-up Form -->
			<div class="form-container">
				<h2 style="color:white;">Sign Up</h2>
				<div class="error-message" id="error-global-register"></div>
		
				<label for="email">Email:</label>
				<div class="error-message" id="error-email-register"></div>
				<input type="text" name="email" id="email-register">
		
				<label for="password">Password:</label>
				<div class="error-message" id="error-password-register"></div>
				<input type="password" name="password" id="password-register">
		
				<label for="cpassword">Confirm Password:</label>
				<input type="password" name="cpassword" id="cpassword">
		
				<input type="button" id="submit-register" value="Sign Up">
			</div>
		</div>

		<script type="module" src="/public/auth/login.js"></script>
		<script type="module" src="/public/auth/register.js"></script>
	</body>

	</html>`

	reply.type('text/html').send(htmlContent);
})

const start = async () => {
	try {
		await loadModules()

		await server.listen({ port: 8084, host: '0.0.0.0' });
		console.log('auth service is running on port 8080');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();
