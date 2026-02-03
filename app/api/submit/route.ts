import fs from "fs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files");

  try {
    if (!fs.existsSync("app/uploads")) {
      console.log("Uploads doesn't extist");
    }
    if (!fs.existsSync("public")) {
      console.log("@Public doesn't work");
    }
  } catch (err) {
    console.log(err);
  }

  return new Response(JSON.stringify(files), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
