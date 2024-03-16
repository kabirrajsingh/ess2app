
import TravelLogModel from "@models/TravelLog";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, {params}) {
  // return NextResponse.json({message:"route is working"},{status:200})
  try {
    await ConnectToDb();
    const  {id}  = params;
    if (!id) {
      return NextResponse.json({
        error: "Invalid request. 'id' parameter is missing.",
      }, {
        status: 400, // Bad Request
      });
    }
    try{
      const convertedId = new mongoose.Types.ObjectId(id);
      const log = await TravelLogModel.findById(convertedId);
      if (!log) {
        return NextResponse.json({
          error: "Log not found.",
        }, {
          status: 404, // Not Found
        });
      }
  
      return NextResponse.json({
        message: "Log fetched successfully",
        log: log,
      }, {
        status: 200,
      });
    }catch{
      return NextResponse.json({
        error: "Invalid IDr",
      }, {
        status: 500,
      });
    }
    
    

    
  } catch (error) {
    console.error("Error fetching logs:", error);

    return NextResponse.json({
      error: "Server Error",
    }, {
      status: 500,
    });
  }
}


export async function DELETE(req, {params}) {
  try {
    // Connect to the database
    await ConnectToDb();

    // Extract 'id' from request parameters
    const { id } = params;

    // Check if 'id' is provided
    if (!id) {
      return NextResponse.json(
        {
          error: "Invalid request. 'id' parameter is missing.",
        },
        {
          status: 400, // Bad Request
        }
      );
    }

    // Delete the travel log
    const deletedTravelLog = await TravelLogModel.deleteOne({ _id: id });

    // Check if the travel log was not found
    if (!deletedTravelLog) {
      return NextResponse.json(
        {
          message: "Invalid log",
        },
        {
          status: 500,
        }
      );
    }

    // Respond with success message and deleted travel log
    return NextResponse.json(
      {
        message: "Log deleted successfully",
        deletedTravelLog: deletedTravelLog,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}