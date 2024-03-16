import { NextResponse } from "next/server";
import { ConnectToDb } from "@utils/db";
import User from "@models/user";
export async function POST(req, res) {
    const reqbody = await req.json();
    const { refreshToken, EmployeeID } = reqbody;


    try {
        await ConnectToDb();

        // Assuming your User model has a field called 'refreshToken'
        let filterQuery = { EmployeeID: EmployeeID };
        const updatedUser = await User.findOneAndUpdate(
            filterQuery,
            { $set: { refreshToken: refreshToken }},
            { new: true } // This option returns the updated document
        );

        if (!updatedUser) {
            // Handle the case when the user with the specified EmployeeID is not found
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }

        return NextResponse.json({
            user: updatedUser,
            message: "Refresh token updated successfully",
            status: 200
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json({
            message: "Internal server error",
            status: 500
        });
    }
}