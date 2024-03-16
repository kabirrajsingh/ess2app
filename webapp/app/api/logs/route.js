import TravelLogModel from "@models/TravelLog";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await ConnectToDb();
    const reqbody = await req.json();
    const userId = reqbody.userId;
    const sortType = reqbody.sortType;
    const filterType = reqbody.filterType;
    const limit = reqbody.limit; // Keep the limit value from request, if present

    let sortQuery = { _id: -1 };
    let filterQuery = { EmployeeID: userId };

    if (sortType === "oldest") {
      sortQuery = { DateOfTravel: 1 };
    } else if (sortType === "newest") {
      sortQuery = { DateOfTravel: -1 };
    } else if (sortType === "highest") {
      sortQuery = { ExpensesIncurred: -1 };
    } else if (sortType === "lowest") {
      sortQuery = { ExpensesIncurred: 1 };
    }

    if (filterType === "flight") {
      filterQuery = { ...filterQuery, TravelMode: "flight" };
    } else if (filterType === "cab") {
      filterQuery = { ...filterQuery, TravelMode: "cab" };
    } else if (filterType === "bus/auto") {
      filterQuery = { ...filterQuery, TravelMode: "bus/auto" };
    }

    let logsQuery = TravelLogModel.find(filterQuery).sort(sortQuery);

    if (limit !== undefined) {
      logsQuery = logsQuery.limit(parseInt(limit, 10)); // Applying the limit to the query
    }

    const logs = await logsQuery;

    return NextResponse.json({
      message: "Logs fetched successfully",
      logs: logs,
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
