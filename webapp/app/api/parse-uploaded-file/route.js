import axios from "axios";
import { NextResponse } from "next/server";


export async function POST(request, res) {
  const formData = await request.formData();
  const fileExtension = formData.get("fileExtension");


  try {
    // Send the file to the Flask server  
    if (
      fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "png") {
      const response = await axios.post(
        "http://127.0.0.1:5000/parse-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response from Flask server:", response.data);

      if (response.status==500) return NextResponse.json({ error: "Error parsing image." }, { status: 500 });

      return NextResponse.json(response.data, { status: 200 });
    } else if (fileExtension == "pdf") {
      const response = await axios.post(
        "http://127.0.0.1:5000/parse-pdf",
        formData,
      );
      console.log("Response from Flask server:", response.data);
      if (response.status==500) return NextResponse.json({ error: "Error parsing PDF." }, { status: 500 });
      return NextResponse.json(response.data, { status: 200 });
    }
  } catch (error) {
    console.error("Error sending request:", error);
    return NextResponse.json(
      { error: "Please check for valid receipt." },
      { status: 500 }
    );
  }
}
