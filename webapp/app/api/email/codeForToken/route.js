import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(req, res) {
    const {code,EmployeeID}=await req.json();
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    console.log("clientSecret is",clientSecret,code)
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code:code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        }),
    });

    const data = await response.json();

    const refreshToken = data.refresh_token;
    const addRefreshTokenResponse = await axios.post("http://localhost:3000/api/email/addRefreshToken", {
        refreshToken:refreshToken,
        EmployeeID: EmployeeID,
    });
    if(addRefreshTokenResponse.status=="200"){
        return NextResponse.json({message:"Authorization Successful"},{status:200});
    }
    return NextResponse.json({message:"Authorization failed"},{status:500})
}

