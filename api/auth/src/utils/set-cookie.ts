import {FastifyReply} from "fastify";

export async function setCookie(reply: FastifyReply, token: string): Promise<void> {
	reply.setCookie('token', token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: true,
		maxAge: 2_592_000
	})
}