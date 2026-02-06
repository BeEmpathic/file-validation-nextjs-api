import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = (formData.getAll("files") as File[]) || {};
  const filesArray = [];

  // The message returned to the user
  let message: string = "";
  console.log("the files at the begining: ", files);

  // uploaded files names
  const uploadedFilesNames: string[] = [];
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

  // file validation starts here

  // regex
  const FILE_PATH_REGEX = /([^A-z0-9_\- ])/;
  console.log("files: ", files);
  await Promise.all(
    files.map(async (file) => {
      try {
        // check if file isn't empty
        if (file.size <= 0) {
          throw new Error("File is empty");
          return;
        }

        // checking if the file's size isn't too big 10MB
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("This file is like your mom, it's too big!");
        }
        // dealing with file's name
        const fileClientName = path.basename(file.name || "unnamed").trim();
        const fileNoDotsName = fileClientName.replaceAll(".", "");

        if (FILE_PATH_REGEX.test(fileNoDotsName)) {
          throw new Error(
            "Invalid file name. File shoudn't contain special characters",
          );
        }

        // checking files name length
        if (fileNoDotsName.length === 200) {
          throw new Error(
            "Invalid file name. File name should be less than 200 characters",
          );
        }

        const extension = path.extname(fileClientName).toLowerCase();
        const fileServerName =
          `${v4()}-${fileNoDotsName}${extension}` as string;

        console.log("file server name: ", fileServerName);

        // saving the file to the disk
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(upoladDir, fileServerName);
        await fs.writeFile(filePath, buffer);

        // giving the message to the user
        uploadedFilesNames.push(`uploads/${fileServerName}`);
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
