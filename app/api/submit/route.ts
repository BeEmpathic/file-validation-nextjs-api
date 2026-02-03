import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  let message: string = "";

  if (files.length === 0) {
    let message = "No files uploaded.";
    return new Response(JSON.stringify(message), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const uploadedFiles: string[] = [];
  const upoladDir = path.join(process.cwd(), "public/uploads");

  try {
    await fs.mkdir(upoladDir, { recursive: true });
  } catch (error) {
    console.error("Error creating directory: ", error);
    return new Response(JSON.stringify("Error creating directory"), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  files.map(async (file) => {
    try {
      const filename = `${v4()}-${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(upoladDir, filename);
      await fs.writeFile(filePath, buffer);
      uploadedFiles.push(`uploads/${filename}`);
      message += `File ${file.name} uploaded successfully as ${filename}\n`;
    } catch (error) {
      console.error("Error saving file: ", error);
      message += `Error saving file ${file.name}: ${error}\n`;
    }
  });

  return new Response(JSON.stringify(message), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
