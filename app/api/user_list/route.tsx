

export async function GET(req: Request) {

	const auth = req.headers.get("Authorization");
	if (auth && auth.startsWith("Basic ")) {
		const base64Credentials = auth.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
		const [username, password] = credentials.split(':');
		if (username === 'testuser' && password === 'testpassword') {
			// User is authenticated
			const res = Response.json([{"username": "string", "localAccount": "string", "accountCreated": "string", "tokenExpires": "string"}]);
			return res;
		}
	}
	return Response.unauthorized("Unauthorized");
}
