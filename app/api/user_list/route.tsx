export async function OPTIONS() {
	return new Response(null, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization"
		}
	});
}


export async function GET(req: Request) {

	const auth = req.headers.get("Authorization");
	if (auth && auth.startsWith("Basic ")) {
		const base64Credentials = auth.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
		const [username, password] = credentials.split(':');
		if (username === 'testuser' && password === 'testpassword') {
			// User is authenticated return a list of fake users
			const res = Response.json([
					{"username": "string0", "localAccount": "string0", "accountCreated": "string0", "tokenExpires": "string0"},
					{"username": "string1", "localAccount": "string1", "accountCreated": "string1", "tokenExpires": "string1"},
					{"username": "string2", "localAccount": "string2", "accountCreated": "string2", "tokenExpires": "string2"},
					{"username": "string3", "localAccount": "string3", "accountCreated": "string3", "tokenExpires": "string3"},
					{"username": "string4", "localAccount": "string4", "accountCreated": "string4", "tokenExpires": "string4"},
					{"username": "string5", "localAccount": "string5", "accountCreated": "string5", "tokenExpires": "string5"},
					{"username": "string6", "localAccount": "string6", "accountCreated": "string6", "tokenExpires": "string6"},
					{"username": "string7", "localAccount": "string7", "accountCreated": "string7", "tokenExpires": "string7"},
					{"username": "string8", "localAccount": "string8", "accountCreated": "string8", "tokenExpires": "string8"},
					{"username": "string9", "localAccount": "string9", "accountCreated": "string9", "tokenExpires": "string9"}
				]);

			// const res = Response.json([{"username": "string", "localAccount": "string", "accountCreated": "string", "tokenExpires": "string"}]);
			res.headers.set("Access-Control-Allow-Origin", "*");
			return res;
		}
	}
	return new Response.error();
}
