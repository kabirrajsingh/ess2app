"use client";
import Navbar from "@components/Navbar";
import userContext from "@context/userContext";
import { getCoordinates } from "@utils/geocode";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
const page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [addAddress, setAddAddress] = useState(false);
  const [addAddressTag, setAddAddressTag] = useState("");
  const [addAddressValue, setAddAddressValue] = useState("");

  const {
    defaultPaymentMode,
    setDefaultPaymentMode,
    defaultTravelPurpose,
    setDefaultTravelPurpose,
    addresses,
    setAddresses,
  } = useContext(userContext);

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
    }
  }, [status]);

  useEffect(() => {
    if (
      !defaultTravelPurpose ||
      !defaultPaymentMode ||
      addresses.length === 0
    ) {
      fetchUserData();
    }
  }, [defaultTravelPurpose, defaultPaymentMode, addresses, user]);

  const fetchUserData = async () => {
    try {
      const response = await axios.post("/api/profile/getData", {
        EmployeeID: user.EmployeeID,
      });
      const userData = response.data.userData;
      setDefaultTravelPurpose(userData.defaultTravelPurpose);
      setDefaultPaymentMode(userData.defaultPaymentMode);
      setAddresses(userData.addresses);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleAddressAdd = async () => {
    const coordindates = await getCoordinates(addAddressValue);

    const newAddress = {
      address: addAddressValue,
      tag: addAddressTag,
      latt: coordindates.latt,
      longt: coordindates.longt,
    };

    const response = await axios.post("/api/profile/addresses", {
      EmployeeID: user.EmployeeID,
      address: newAddress,
    });
    setAddresses(response.data.user.addresses);
    setAddAddress(false);
  };

  const handlePaymentModeChange = async () => {
    const response = await axios.post("/api/profile/paymentMode", {
      EmployeeID: user.EmployeeID,
      paymentMode: paymentMode,
    });
    setDefaultPaymentMode(response.data.user.defaultPaymentMode);
  };

  const handleTravelPurposeChange = async () => {
    const response = await axios.post("/api/profile/travelPurpose", {
      EmployeeID: user.EmployeeID,
      travelPurpose: travelPurpose,
    });
    setDefaultTravelPurpose(response.data.user.defaultTravelPurpose);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center gap-4 p-4 w-full  divide-y">
        <h1 className="text-4xl font-bold">Profile</h1>
        <div className="text-3xl font-semibold flex flex-row gap-4">
          <div>Employee ID : </div>
          <div>{user ? user.EmployeeID : ""}</div>
        </div>
        <div className="flex 2xl:flex-row flex-col gap-5 2xl:gap-20 2xl:w-12/12 2xl:mx-auto 2xl:p-4 h-full">
          <div className="flex flex-col w-full h-full bg-slate-100 border-2 border-blue-primary rounded-lg p-4">
            <div className="flex flex-col justify-between items-start gap-4 w-full py-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold ">
                  Default Travel Purpose
                </h1>
              </div>
              <div className="flex flex-row gap-3 items-center w-full">
                <select
                  className="rounded-md h-10 border border-blue-primary cursor-pointer w-8/12"
                  name="travelPurpose"
                  id="travelPurpose"
                  value={defaultTravelPurpose}
                  onChange={(e) => setDefaultTravelPurpose(e.target.value)}
                >
                  <option className="" value="Daily Commute">
                    Daily Commute
                  </option>
                  <option className=" " value="Business Visit">
                    Business Visit
                  </option>
                </select>
                <button
                  onClick={handleTravelPurposeChange}
                  className="p-4 py-2  rounded-md text-center text-white bg-blue-primary hover:bg-blue-800 cursor-pointer w-4/12"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between items-start gap-4 w-full py-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold ">Default Payment Mode</h1>
              </div>
              <div className="flex flex-row gap-3 items-center  w-full">
                <select
                  className="rounded-md h-10 border border-blue-primary cursor-pointer w-8/12"
                  name="paymentMode"
                  id="paymentMode"
                  value={defaultPaymentMode}
                  onChange={(e) => setDefaultPaymentMode(e.target.value)}
                >
                  <option className="" value="Cash">
                    Cash
                  </option>
                  <option className=" " value="Corporate CC">
                    Corporate Credit Card
                  </option>
                </select>
                <button
                  onClick={handlePaymentModeChange}
                  className="p-4 py-2  rounded-md text-center text-white bg-blue-primary hover:bg-blue-800 cursor-pointer w-4/12"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start gap-4 w-full bg-slate-100 border-2 border-blue-primary rounded-lg p-4">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="text-2xl font-semibold">Addresses</div>
              {!addAddress && (
                <button
                  onClick={() => setAddAddress(true)}
                  className="p-4 py-2  rounded-md text-center text-white bg-blue-primary hover:bg-blue-800 cursor-pointer w-4/12"
                >
                  Add New
                </button>
              )}
              {addAddress && (
                <button
                  onClick={() => setAddAddress(false)}
                  className="p-4 py-2  rounded-md text-center text-white bg-blue-primary hover:bg-blue-800 cursor-pointer w-4/12"
                >
                  Cancel
                </button>
              )}
            </div>
            {addAddress && (
              <div className="flex flex-col justify-between gap-4 items-center w-full">
                <div className="w-full flex flex-row gap-4 justify-between items-center">
                  <input
                    value={addAddressTag}
                    onChange={(e) => setAddAddressTag(e.target.value)}
                    className="capitalize px-2 border-2 border-neutral-300 h-10 rounded-sm w-8/12"
                    placeholder="Address Tag"
                    type="text"
                  />
                  <button
                    onClick={handleAddressAdd}
                    className="p-4 py-2  rounded-md text-center text-white bg-blue-primary hover:bg-blue-800 cursor-pointer w-4/12"
                  >
                    Save
                  </button>
                </div>
                <input
                  value={addAddressValue}
                  onChange={(e) => setAddAddressValue(e.target.value)}
                  className="px-2 border-2 border-neutral-300 h-10 rounded-sm w-full"
                  placeholder="Enter new address here"
                  type="text"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 w-full divide-y-2">
              {addresses &&
                addresses.map((address, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center w-full  gap-2"
                  >
                    <div className="text w-10/12 flex flex-col gap-2 items-start">
                      <div className="text-xl font-semibold capitalize">
                        {address.tag}
                      </div>
                      <div className="">{address.address}</div>
                    </div>
                    <button className="p-4 py-2 jus rounded-md text-center text-white bg-red-600 hover:bg-red-800 cursor-pointer w-3/12">
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
