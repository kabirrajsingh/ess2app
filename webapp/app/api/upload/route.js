import { fileTypeFromBuffer } from 'file-type';
import { mkdir, stat, writeFile } from "fs/promises";
import mime from "mime";
import { NextResponse } from "next/server";
import { join } from "path";

export async function POST(request,res) {
  const formData = await request.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  
  // Check file extension
  const fileName = file.name;
  const fileExtension = fileName.split(".").pop().toLowerCase();

  // Allowed file extensions: PDF, JPG, JPEG, PNG
  const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];

  if (!allowedExtensions.includes(fileExtension)) {
    return NextResponse.json(
      {
        error:
          "Invalid file format. Only PDF, JPG, JPEG, and PNG files are allowed.",
      },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileSignature = await fileTypeFromBuffer(buffer);


  if(fileSignature['mime'] == "application/pdf" || fileSignature['mime'] == "image/jpeg" || fileSignature['mime'] == "image/png"){
    console.log("File type is correct");
  }
  else{
    console.log("File type is incorrect");
    return NextResponse.json(
      {
        error:
          "Invalid file format. Only PDF, JPG, JPEG, and PNG files are allowed.",
      },
      { status: 400 }
    );
  }

  
  

  const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), "uploads");

  try {
    await stat(uploadDir);
  } catch (e) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    const fileUrl =filename;
    console.log(fileUrl); 
    return NextResponse.json({ fileUrl: fileUrl,fileExtension:fileExtension });
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}