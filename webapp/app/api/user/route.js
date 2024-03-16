import TravelLogModel from "@models/TravelLog";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    console.log("Here")
    return NextResponse.json({
      message: "hahaha",
    });
  } catch (error) {
    console.error("Error fetching logs:", error);

    return NextResponse.json({
      error: "Server Error",
    }, {
      status: 500,
    });
  }
}
