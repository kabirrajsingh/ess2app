"use client"
import { useSession,getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
const Page = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Fetch user data from your backend API
        if (status === 'authenticated') {
            setUser(session.user);
            console.log(user)
        }
    }, [session, status]);
    useEffect(()=>{
        const fetchUserData = async () => {
            try {
                const EmployeeID=user.EmployeeID
              const response = await axios.get(`/api/user/{EmployeeID}`); // Replace with your API endpoint
              const userData = response.data;
    
      
              // Check if the requestToken field is present
              setShowImportButton(userData && userData.requestToken);
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          };
      
          fetchUserData();
    },
    [session,status])
    
  
    const handleConnectToGmail = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        const scope = 'https://mail.google.com'; 
    
        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`;
        
        window.location.href = authUrl;
        // console.log(authUrl)
    };
    const handleEmailUpdate=async()=>{
        const response=await axios.post('/api/email/getEmails',{"EmployeeID":user.EmployeeID,refreshToken:user.refreshToken})
        console.log(response.data.parsedReceipts)
    }

    return (
        <>

        {user&& user.refreshToken ?(<div> User connected to gmail. <button onClick={handleEmailUpdate}> Update logs from email</button></div>):(<button onClick={handleConnectToGmail}> Connect to Gmail</button>)}
        </>
    )
}
export default Page;