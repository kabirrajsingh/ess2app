import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function POST(req) {
    const { EmployeeID, Email, Password } = await req.json();
    
    if (!EmployeeID || !Email || !Password) {
        return NextResponse.json({ message: "Missing Fields" }, { status: 401 });
    }

    try {
        await ConnectToDb();

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(Password, 10);

        await User.create({ EmployeeID, Email, Password: hashedPassword });
        return NextResponse.json({ message: "User registered" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error occurred while registering user", error: error }, { status: 500 });
    }
}
