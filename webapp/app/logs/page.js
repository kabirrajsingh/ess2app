"use client";
import Navbar from "@components/Navbar";
import RecordCard from "@components/RecordCard";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const [logs, setLogs] = useState([]);
  const { data: session, status } = useSession();
  const [sortType, setSortType] = useState(null);
  const [filterType, setFilterType] = useState(null);

  const fetchLogs = async () => {
    try {
      if (!session || !session.user || !session.user.EmployeeID) {
        console.error("Invalid session structure or missing user information");
        return;
      }
      console.log(session.user);
      const form = {
        userId: session.user.EmployeeID,
        sortType: sortType,
        filterType: filterType,
      };
      console.log("form is");
      console.log(form);
      const response = await axios.post("/api/logs", form);

      console.log("Response:", response);
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    if (session) {
      console.log("Here");
      fetchLogs();
    }
  }, [session, sortType, filterType]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-row p-2 justify-between">
        <div className="text-2xl font-semibold">Your Logs</div>
        <div className=" w-7/12 flex flex-row gap-2">
          <select
            className="w-1/2 border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 "
            type="text"
            name="sort"
            defaultValue="sort"
            onChange={(e) => {
              setSortType(e.target.value);
            }}
          >
            <option value="sort" disabled>
              Sort
            </option>
            <option value="oldest">By Oldest</option>
            <option value="newest">By Newest</option>
            <option value="highest">By Price{"(highest)"}</option>
            <option value="lowest">By Price{"(lowest)"}</option>
          </select>
          <select
            className="w-1/2 border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 "
            type="text"
            name="filter"
            defaultValue="filter"
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          >
            <option value="filter" disabled>
              Filter
            </option>
            <option value="flight">Flight</option>
            <option value="cab">Cab</option>
            <option value="bus/auto">Bus/Auto/Public Transport</option>
          </select>
        </div>
      </div>

      <div className="2xl:p-4 p-1">
        {logs.length>0 && logs.map((record) => (
          <RecordCard key={record._id} record={record} />
        ))}
        {logs.length==0 && <div className="text-2xl font-semibold text-center">No logs found</div>}
      </div>
    </div>
  );
};

export default Page;
