import { Database } from "sqlite";
import {User} from "../interface/user.js";

declare module 'fastify' {
	interface FastifyInstance {
		authDb: Database
		usersDb: Database
	}
}