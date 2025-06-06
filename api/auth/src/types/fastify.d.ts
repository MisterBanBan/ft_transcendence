import { Database } from "sqlite";
import {User} from "../interface/user.js";

declare module 'fastify' {
	interface FastifyInstance {
		db: Database
	}
	interface FastifyRequest {
		currentUser?: User;
	}
}