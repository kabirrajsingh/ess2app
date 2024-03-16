"use client"
import Navbar from '@components/Navbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
const LogDetailsPage = ({params}) => {
  const router=useRouter();
    
    const [loading,  setloading]  = useState(false)
    const [log,setLog]=useState({})
    const fetchLog=async()=>{
        const logDetails=await axios.get(`/api/logs/${params.logId}`)
        console.log(logDetails)
        setLog(logDetails.data.log)
    }
    useEffect(() => {
      fetchLog()
    }, [])

    const notify = (str) => toast(str);

    const handleLogDelete=async()=>{
      try {
        setloading(true)
        const logDetails=await axios.delete(`/api/logs/${params.logId}`)
        console.log(logDetails)
        setloading(false)
        router.push("/")
        notify("Log deleted successfully")
      } catch (error) {
        notify("Failed to delete log")
      }
    }
    
  return (
    <>
      <Navbar/>
      <h1 className="text-4xl font-bold  p-4">Log Details</h1>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <strong>From:</strong> {log.FromPlace}
        </div>
        <div>
          <strong>To:</strong> {log.ToPlace}
        </div>
        <div>
          <strong>Date of Travel:</strong> {new Date(log.DateOfTravel).toLocaleDateString()}
        </div>
        <div>
          <strong>Travel Mode:</strong> {log.TravelMode}
        </div>
        <div>
          <strong>Purpose of Travel:</strong> {log.PurposeOfTravel}
        </div>
        <div>
          <strong>Distance Traveled:</strong> {log.DistanceTraveled} miles
        </div>
        <div>
          <strong>Expenses Incurred:</strong> &#8377;{log.ExpensesIncurred}
        </div>
        <div>
          <strong>Payment Mode:</strong> {log.PaymentMode}
        </div>
        <div>
          <strong>Comments:</strong> {log.Comments}
        </div>
        <div>
          <strong>Type of Upload:</strong> {log.TypeOfUpload}
        </div>
        <div>
          <strong>Proof ID:</strong> {log.ProofID}
        </div>
        <div>
          <strong>File Url:</strong> {log.FileUrl}
        </div>
        <a
              className="bg-red-600 flex justify-between items-center px-6 py-2 rounded-md gap-4 text-white font-semibold text-lg"
              onClick={handleLogDelete}
            >
              Delete Log
            </a>
      </div>
    </>
  );
};

export default LogDetailsPage;
