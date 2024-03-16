'use client';
import Login from "@components/Login";
import Register from "@components/Register";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import biglogo from "../../assets/biglogo.png";
const page = () => {
  const { data: session } = useSession();
  const [login, setLogin] = useState(true);

  const router = useRouter();
  useEffect(() => {
    // If the user is already logged in, redirect to the homepage
    if (session) {
      const {user}=session;
      console.log(user)
      router.replace("/");
    }
  }, [session, router]);
  return (
    <div className="h-screen w-screen flex justify-center items-start">
      <div className="flex flex-col justify-center items-center py-8">
        <Image alt="" src={biglogo} className=" w-5/12 2xl:w-3/12" />
        <h1 className="text-lg font-semibold">Keep log of all your travels</h1>
        <div className="bg-blue-100  w-full 2xl:w-5/12 p-4 mt-10  flex flex-col gap-4 justify-start items-center">
          <div className="flex flex-row gap-4 w-full">
            <button onClick={()=>setLogin(true)} className={`${ login? "bg-blue-primary text-white" : "border-2 border-neutral-500 text-blue-primary"} w-full  font-semibold p-1 rounded`}>Login</button>
            <button onClick={()=>setLogin(false)} className={`${ !login? "bg-blue-primary text-white" : "border-2 border-neutral-500 text-blue-primary"} w-full  font-semibold p-1 rounded`}>Register</button>
           
          </div>
          { login? <Login/> : <Register/>}
        </div>
      </div>
    </div>
  );
};

export default page;
