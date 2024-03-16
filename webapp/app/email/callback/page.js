'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import axios from 'axios';

const GmailCallback = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
    const [message,setMessage]=useState("Processing")
  const exchangeCodeForToken = async (code, employeeID) => {
    try {
      const response = await axios.post('/api/email/codeForToken', {
        code: code,
        EmployeeID: employeeID,
      });
      console.log(response);
      if (response.status === 200) {
        setMessage("Email has been linked successfully. Redirecting you back to homepage in 5 seconds.")
        setTimeout(() => {
            router.push('/');
          }, 5000);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  const getCodeFromUrl = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get('code');
  };

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user);
    }
  }, [session, status]);

  useEffect(() => {
    const code = getCodeFromUrl();
    if (user && user.EmployeeID && code) {
      exchangeCodeForToken(code, user.EmployeeID);
    }
  }, [user, status]);

  return <div>{message}</div>;
};

export default GmailCallback;