export async function POST(request: Request) {
	const formData = await request.formData();
	const files = formData.getAll("files");
	const data = Object.fromEntries(formData);
	console.log("Raw form data:", formData);
	console.log ("Files:", files);
	console.log("Object.FromEntries():", data)

	return new Response(JSON.stringify(data),
	{
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
} 