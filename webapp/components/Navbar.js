// Navbar.jsx
"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import bell from "../assets/bell.png";
import burger_menu from "../assets/burger_menu.png";
import close from "../assets/close.png";
import logo from "../assets/logo.png";
const Navbar = () => {
  const router=useRouter()
  const data=useSession()
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  useEffect(() => {

    if (status === 'authenticated') {
      setUser(session.user);
      // setUser(session.user);
    }
  }, [status]);

  const [menu, setMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="bg-blue-primary px-4 py-3 flex flex-row justify-between items-center sticky top-0">
      <Image src={logo} alt="Logo" className="h-10 w-auto" onClick={()=>router.push('/')}/>
      <div className="flex flex-row justify-center items-center gap-6 ">
        <Link href={"/notifications"} className="relative cursor-pointer">
          <div className="bg-red-500 rounded-full absolute top-0 left-0 text-center p-1 text-white text-xs">12</div>
          <button>
            <Image src={bell} alt="bell" className="h-10 w-auto" />
          </button>
        </Link>
        <button onClick={() => setMenu(true)}>
          <Image src={burger_menu} alt="Logo" className="h-8 w-auto" />
        </button>
      </div>

      <div
        className={`bg-blue-primary h-screen absolute flex flex-col justify-start items-end gap-10 top-0 right-0 duration-300 ease-in-out ${
          menu ? "w-auto px-10 py-4" : "w-0"
        } `}
      >
        {menu ? (
          <>
            <button className="cursor-pointer" onClick={() => setMenu(false)}>
              <Image src={close} alt="close" className="h-8 w-8" />
            </button>

            <ul className="flex flex-col gap-4 text-yellow-primary text-lg 2xl:text-xl font-medium">
              <li>Home</li>
              <li>Create Log</li>
              <li>See Logs</li>
              <Link href='/profile'><li>Profile</li></Link>
              <li>Analytics</li>
              <li>{user ? `Employee ID ${user.EmployeeID}` : "User not available"}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;
