import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import { NextResponse } from "next/server";

export async function POST(req, res){
    try{
        await ConnectToDb();
        const data = await req.json();
        const empId = data.EmployeeID;
        const address = data.address;

        const user = await User.findOne({ EmployeeID: empId });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        user.addresses.push(address);
        console.log("here");
        await user.save();

        return NextResponse.json({ user }, { status: 200 });
    }
    catch(error){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}