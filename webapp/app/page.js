"use client";
import DateRangePicker from "@components/DateRangePicker";
import DisplayDateRange from "@components/DisplayDateRange";
import LogTable from "@components/page";
import userContext from "@context/userContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import envelopeImg from "../assets/envelope.png";
import notepadImg from "../assets/notepad.png";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [spinnerMsg, setSpinnerMsg] = useState("Please wait");
  const [disconnectGmailFlag, setDisconnectGmailFlag] = useState(false);

  const notify = (str) => toast(str);

  const {
    defaultPaymentMode,
    setDefaultPaymentMode,
    defaultTravelPurpose,
    setDefaultTravelPurpose,
    addresses,
    setAddresses,
  } = useContext(userContext);

  useEffect(() => {
    // Check loading status of individual actions and set the overall page loading status
    setPageLoading(loading);
  }, [loading]);

  // Set user context variables when session is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
      setDefaultPaymentMode(session.user.defaultPaymentMode);
      setDefaultTravelPurpose(session.user.defaultTravelPurpose);
      setAddresses(session.user.addresses);
    }
  }, [session, status]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const EmployeeID = user.EmployeeID;
        const response = await axios.get(`/api/user/${EmployeeID}`);
        const userData = response.data.user;
        setUserData(userData);
        setDefaultPaymentMode(userData.defaultPaymentMode);
        setDefaultTravelPurpose(userData.defaultTravelPurpose);
        setAddresses(userData.addresses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user, disconnectGmailFlag]);

  const handleConnectToGmail = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    const scope = "https://mail.google.com"; // Adjust the scope as needed

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`;

    window.location.href = authUrl;
  };

  const handleEmailUpdate = async () => {
    if (!startDate || !endDate) {
      notify("Please select a valid date range");
      return;
    }
    try {
      setPageLoading(true);
      setSpinnerMsg("Fetching Emails");
      const response = await axios.post("/api/email/getEmails", {
        EmployeeID: user.EmployeeID,
        after: startDate,
        before: endDate,
      });
      const reply=await response.data.message
      notify(reply);
    } finally {
      setPageLoading(false);
    }
  };
  const handleDisconnectGmail = async () => {
    try {
      setPageLoading(true);
      setSpinnerMsg("Disconnecting Email");
      const response = await axios.post("/api/email/revoke", {
        EmployeeID: user.EmployeeID,
      });
      // console.log(response)
      setDisconnectGmailFlag((prevFlag) => !prevFlag);
      notify(response.data.message);
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <LoadingOverlay active={pageLoading} spinner text={spinnerMsg}>
      <Navbar />

      <div className="p-0 flex flex-col 2xl:flex-row ">
        <div className="flex flex-col 2xl:items-center gap-4 p-10 h-full">
          <Link
            href={"/create-log"}
            className="bg-blue-primary 2xl:w-10/12  flex justify-between items-center px-6 py-2 rounded-md gap-4 text-white font-semibold text-lg"
          >
            <Image alt="" src={notepadImg} className="h-10 w-auto" /> Create Log
            Manually
          </Link>
          {userData && userData.refreshToken ? (
            <>
              <a
                className="bg-yellow-primary 2xl:w-10/12 flex justify-between items-center px-6 py-2 rounded-md gap-4 text-white font-semibold text-lg"
                onClick={handleEmailUpdate}
              >
                <Image alt="" src={envelopeImg} className="h-10 w-auto" />
                Import from Email
              </a>
              <a
                className="bg-red-600 flex 2xl:w-10/12 justify-between items-center px-6 py-2 rounded-md gap-4 text-white font-semibold text-lg"
                onClick={handleDisconnectGmail}
              >
                <Image alt="" src={envelopeImg} className="h-10 w-auto" />
                Disconnect Gmail
              </a>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
              <DisplayDateRange startDate={startDate} endDate={endDate} />
            </>
          ) : (
            <button
              onClick={handleConnectToGmail}
              className="bg-yellow-primary flex justify-between items-center px-6 py-2 rounded-md gap-4 text-white font-semibold text-lg"
            >
              <Image alt="" src={envelopeImg} className="h-10 w-auto" />
              Connect To Gmail
            </button>
          )}
        </div>
        <div className="flex flex-col 2xl:gap-10 gap-2 p-2 2xl:p-5 h-full ">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-neutral-900 font-semibold text-lg 2xl:text-2xl">
              Recent Records
            </h1>
            <Link href="/logs">
              <button className="bg-blue-primary text-white 2xl:px-10 2xl:text-2xl px-4 py-2 rounded flex justify-center items-center gap-1 font-semibold">
                Go to Logs <span className="font-bold text-lg">&#8599;</span>
              </button>
            </Link>
          </div>
          <div className="flex flex-col bg-neutral-200 divide-y divide-slate-600 overflow-scroll">
            <LogTable />
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}
