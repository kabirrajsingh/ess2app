"use client"
import { useEffect, useState } from 'react';
import { getSession ,useSession} from 'next-auth/react';
import axios from 'axios';

export default function Profile() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [profile,setProfile]=useState(null);
    useEffect(() => {
        // Fetch user data from your backend API
        if (status === 'authenticated') {
          setUser(session.user);
        }
      }, [session, status]);
  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      try {
        const response = await axios.get(`/api/user/${session.user.EmployeeID}`);
        setProfile(response.data.user)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      {profile ? (
        <>
          <p>Employee ID: {profile.EmployeeID}</p>
          <p>Email: {profile.Email}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
