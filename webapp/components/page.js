"use client";
import RecordCard from "@components/RecordCard";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const LogTable = () => {
  const [logs, setLogs] = useState([]);
  const { data: session, status } = useSession();

  const fetchLogs = async () => {
    try {
      if (!session || !session.user || !session.user.EmployeeID) {
        console.error("Invalid session structure or missing user information");
        return;
      }
      const form={
        userId: session.user.EmployeeID,
        limit:5,
      }
      const response = await axios.post("/api/logs", form);

      setLogs(response.data.logs)

    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchLogs();
    }
  }, [session]);

  return (
    <div>
      {logs.length>0 && logs.map((log) => (
        <RecordCard key={log._id} record={log} />
      ))}
      {logs.length==0 && <div className="text-2xl font-semibold">No logs found</div>}
    </div>
  );
};

export default LogTable;
