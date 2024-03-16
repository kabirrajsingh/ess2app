import TravelLogModel from "@models/TravelLog";
import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";
const mongoose = require('mongoose');

export async function POST(req, res) {
  try {
    await ConnectToDb()
    const data = await req.json()
    // console.log(data)
    // const user = await User.findOne({ EmployeeID: data['EmployeeID'] });

    // data['EmployeeID'] = user._id;
  
    
    const newTravelLog = new TravelLogModel(data);
    const savedTravelLog = await newTravelLog.save();

    return NextResponse.json(
      {
        message: "Log created successfully",
        savedLog: savedTravelLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
