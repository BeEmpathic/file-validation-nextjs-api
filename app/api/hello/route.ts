export async function POST(request: Request) {
	const body = await request.json();
	console.log("The body of the post:", body)
	return new Response(JSON.stringify(body),
		status: 201,
	)
}