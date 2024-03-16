import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";

export async function POST(req, res){
    try{
        await ConnectToDb();
        const data = await req.json();
        const empId = data.EmployeeID;
        const user = await User.findOne({ EmployeeID: empId });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        //get Data for context
        const userData = {
            addresses: user.addresses,
            defaultPaymentMode: user.defaultPaymentMode,
            defaultTravelPurpose: user.defaultTravelPurpose
        }


        return NextResponse.json({ userData }, { status: 200 });
    }
    catch(error){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}