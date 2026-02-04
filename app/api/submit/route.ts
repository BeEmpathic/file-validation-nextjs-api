import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = (formData.getAll("files") as File[]) || {};
  const filesArray = [];

  // The message returned to the user
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
  await Promise.all(
    files.map(async (file) => {
      try {
        // dealing with file's name
        const fileClientName = path.basename(file.name || "unnamed");
        const extension = path.extname(fileClientName).toLowerCase();
        const fileServerName = `${v4()}-${fileClientName}${extension}`;

        console.log("file server name: ", fileServerName);

        // saving the file to the disk
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(upoladDir, fileServerName);
        await fs.writeFile(filePath, buffer);
        uploadedFiles.push(`uploads/${fileServerName}`);
        message += `File ${fileClientName} uploaded successfully as ${fileServerName}\n`;
      } catch (error) {
        console.error("Error saving file: ", error);
        message += `Error saving file ${file.name}: ${error}\n`;
      }
    }),
  );

  return new Response(JSON.stringify(message), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
