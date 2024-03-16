import { NextResponse } from "next/server";
import axios from "axios";
import { ConnectToDb } from "@utils/db";
import User from "@models/user";
export async function POST(req, res) {
    try {
        const reqbody = await req.json();

        await ConnectToDb();
        const { EmployeeID, after, before } = reqbody;

        const user = await User.findOne({ EmployeeID: EmployeeID });



        if (!user) {
            return NextResponse.json({ error: "Incorrect Employee ID" }, { status: 500 });
        }

        const refreshToken = user.refreshToken;

        const postData = new URLSearchParams();
        postData.append('token', refreshToken);

        const axiosOptions = {
            method: 'post',
            url: 'https://oauth2.googleapis.com/revoke',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: postData.toString(),
        };

        // Make the request using Axios
        const response = await axios(axiosOptions);

        // Check if the revocation was successful
        if (response.status === 200) {
            const updatedUser = await User.findOneAndUpdate(
                { EmployeeID: EmployeeID },
                { $unset: { refreshToken: 1 } },
                { new: true }
            );

            // Save the updated user document
            await updatedUser.save();
            return NextResponse.json({ status: 200 ,  message: 'Email disconnected successfully' });
        } else {
            return NextResponse.json({ status: response.status }, { message: 'Revokation failed' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ status: response.status }, { message: 'Revokation failed' });
    }
}
