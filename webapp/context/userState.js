'use client';
import { useState } from "react";
import userContext from "./userContext";

const UserState = (props) => {
  const [defaultPaymentMode, setDefaultPaymentMode] = useState("");
    const [defaultTravelPurpose, setDefaultTravelPurpose] = useState("");
    const [addresses, setAddresses] = useState([]);

  return (
    <userContext.Provider
      value={{
        defaultPaymentMode,
        setDefaultPaymentMode,
        defaultTravelPurpose,
        setDefaultTravelPurpose,
        addresses,
        setAddresses,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserState;