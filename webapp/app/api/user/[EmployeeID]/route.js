import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";
  async function handleGet(req, {params}) {
    const { EmployeeID } = params;
  
    try {
      await ConnectToDb();
      const user = await User.findOne({ EmployeeID });
  
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
      }
      
      return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } 

  export async function GET(req, {params},res) {
    try {
      const response = await handleGet(req,{params});
      return response;
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }