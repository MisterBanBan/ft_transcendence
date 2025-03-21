import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import {promises as fs} from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fastify = Fastify({
  logger: true
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'srcs'),
  prefix: '/public/',
});

fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' };
});

async function loadScripts(directory) {
	try {
    	const dirFiles = await fs.readdir(directory);
		const filteredFiles = dirFiles.filter(file => file.endsWith('.js') || path.extname(file) === '');

    	for (const file of filteredFiles) {
    		const filePath = path.join(directory, file);

 			const stat = await fs.stat(filePath);
  			if (stat.isDirectory())
  			{
    	   		console.log('\x1b[33m', `Opening directory ${filePath}`, '\x1b[0m');
    	    	await loadScripts(filePath);
    		}
    	    else
    	    {
				console.log('\x1b[34m', `Importing file ${file}...`, '\x1b[0m');
				await import(filePath);
				console.log('\x1b[32m', `File ${file} correctly imported`, '\x1b[0m');
			}
    	}
	} catch (error) {
    	console.error('Error reading scripts directory:', error.message);
    	console.error(error.stack);
    	throw error;
 	}
}

async function startServer() {
  try {

	const scriptsDir = path.join(__dirname, 'scripts');
    await loadScripts(scriptsDir);

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();