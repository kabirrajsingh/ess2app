"use client";
import userContext from "@context/userContext";
import { getCoordinates } from "@utils/geocode";
import { getDistance } from "@utils/getDistance";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import { toast } from "react-toastify";
import uploadImg from "../../assets/upload.png";
import Navbar from "../../components/Navbar";

const YourPage = () => {
  const router = useRouter();

  const notify = (str) => toast(str);

  const [loading, setLoading] = useState(false);

  const [spinnerMsg, setSpinnerMsg] = useState("Please wait");

  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [fromPlaceFound, setFromPlaceFound] = useState(null);
  const [toPlaceFound, setToPlaceFound] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false); // State to toggle preview display

  const handleFilePreview = () => {
    setShowPreview(!showPreview); // Show the preview
  };

  const {
    defaultPaymentMode,
    setDefaultPaymentMode,
    defaultTravelPurpose,
    setDefaultTravelPurpose,
    addresses,
    setAddresses,
  } = useContext(userContext);

  //load user data from session
  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
    }
  }, [session, status]);

  useEffect(() => {
    if (
      !defaultTravelPurpose ||
      !defaultPaymentMode ||
      addresses.length === 0
    ) {
      fetchUserData();
    }
  }, [defaultTravelPurpose, defaultPaymentMode, addresses, user]);

  //used to fetch user data(addresses,default payment mode,default travedl purpose) from db to context
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

  const [form, setForm] = useState({
    DateOfTravel: "",
    FromPlace: "",
    FromPlaceTag: "",
    ToPlace: "",
    ToPlaceTag: "",
    TravelMode: "",
    PurposeOfTravel: defaultTravelPurpose,
    DistanceTraveled: "",
    ExpensesIncurred: "",
    PaymentMode: defaultPaymentMode,
    Comments: "",
    TypeOfUpload: "Manual",
    FileUrl: "",
  });

  const [autofill, setAutofill] = useState(false);

  //used to map data received from parsing to form
  const mapReceivedDataToForm = async (receivedData) => {
    const formKeys = Object.keys(form);
    const updatedForm = { ...form };

    formKeys.forEach((key) => {
      if (key in receivedData) {
        updatedForm[key] = receivedData[key] != null ? receivedData[key] : "";
      }
    });

    updatedForm["PurposeOfTravel"] = defaultTravelPurpose;
    updatedForm["PaymentMode"] = defaultPaymentMode;

    return updatedForm;
  };

  const parseUploadedFile = async (fileUrl, fileExtension) => {
    const formData = new FormData();
    formData.append("fileUrl", fileUrl);
    formData.append("fileExtension", fileExtension);
    formData.append("autofill", autofill);
    setLoading(true);
    setSpinnerMsg("Reading your file...");
    let updatedForm = { ...form };
    try {
      const response = await fetch("/api/parse-uploaded-file", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        //map data received from parsing to form and set the updated form
        updatedForm = await mapReceivedDataToForm(responseData);
        console.log(updatedForm);
        setForm(updatedForm);
      } else {
        console.error("File upload failed.");
        setLoading(false);
        setSpinnerMsg("Please wait...");
        const errorData = await response.json();
        setUploadError(errorData.error);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      setSpinnerMsg("Please wait...");
      const errorData = await response.json();
      setUploadError(errorData.error);
      return null;
    }

    //compare from and to address with saved addresses and show the saved address if found
    compareAddress(updatedForm.FromPlace, "FromPlace");
    compareAddress(updatedForm.ToPlace, "ToPlace");

    setLoading(false);
    setSpinnerMsg("Please wait...");
  };

  const handleParsing = async () => {
    //first upload the file to server
    //if upload is successful then parse the file else show error
    //if parsing is successful then map the data to form else show error
    if (file) {
      const resp = await handleFileUpload(file);
      console.log(resp);
      if (resp) {
        const fileUrl = resp.fileUrl;
        const fileExtension = resp.fileExtension;
        parseUploadedFile(fileUrl, fileExtension);
      }
    } else {
      console.error("Log creation failed");
      return;
    }
  };
  useEffect(() => {
    if (autofill) {
      handleParsing();
    }
  }, [file]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setUploadError("Please select a file.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (selectedFile.size > 5000000) {
      setUploadError(
        "The selected file is too large. Please select a file with less than 5 MB"
      );
      setFile(null);
      setPreviewUrl(null);
    } else {
      if (
        selectedFile.type == "application/pdf" ||
        selectedFile.type == "image/jpeg" ||
        selectedFile.type == "image/jpg" ||
        selectedFile.type == "image/png"
      ) {
        setUploadError(null);
        setFile(selectedFile);
        // Read the file and create a preview URL
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
        if(showPreview){
          setShowPreview(false);
        }
      } else {
        setUploadError(
          "Please upload pdf or image only. Supported formats are .pdf , .jpeg, .jpg and .png"
        );
        setFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // console.log("File uploaded successfully.");
        const responseData = await response.json();
        form["ProofID"] = responseData.fileUrl;
        form["EmployeeID"] = session.user.EmployeeID;
        return responseData;
      } else {
        console.error("File upload failed.");
        const errorData = await response.json();
        setUploadError(errorData.error);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorData = await response.json();
      setUploadError(errorData.error);
      return null;
    }
  };

  //used to upload log to db if all the fields are filled else show alert
  const handleLogUpload = async (form) => {
    setLoading(true);
    setSpinnerMsg("Saving your log...");
    // console.log(form)
    try {
      const response = await fetch("/api/create-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        // console.log("Log uploaded successfully.");
        const responseData = await response.json();
        setLoading(false);
        setSpinnerMsg("Saving your log...");
        return responseData.savedLog;
      } else {
        console.error("Log upload failed.");
        setLoading(false);
        setSpinnerMsg("Saving your log...");
        return null;
      }
    } catch (error) {
      console.error("Log uploading file:", error);
      setLoading(false);
      setSpinnerMsg("Saving your log...");
      return null;
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Check if any required field is empty
      for (const key in form) {
        if (
          form[key] === "" &&
          key !== "Comments" &&
          key !== "FileUrl" &&
          key !== "FromPlaceTag" &&
          key !== "ToPlaceTag"
        ) {
          notify(`${key} is required.`);
          return;
        }
      }

      if (file) {
        const resp = await handleFileUpload(file);
        if (resp) {
          const fileUrl = resp.fileUrl;
          if (fileUrl) {
            form["FileUrl"] = fileUrl;
            const response = await handleLogUpload(form);

            if (response) {
              // console.log(response);
              notify("Log successfully created");
              router.push("/");
            } else {
              console.log("Log creation failed");
            }
          } else {
            console.error("Log creation failed");
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const compareAddress = async (address, name) => {
    console.log(name);
    if (addresses.length == 0) {
      return;
    }
    const coord1 = await getCoordinates(address);
    const lat1 = coord1.latt;
    const long1 = coord1.longt;
    for (let i = 0; i < addresses.length; i++) {
      const lat2 = addresses[i].latt;
      const long2 = addresses[i].longt;

      const d = getDistance(lat1, long1, lat2, long2);
      console.log(d);
      if (d < 500.0) {
        if (name == "FromPlace") {
          setFromPlaceFound(addresses[i]);
        } else {
          setToPlaceFound(addresses[i]);
        }
        break;
      }
    }
  };

  //if saved address is selected then set the address in form
  const handleSavedAddressSelect = (address, name) => {
    if (name == "FromPlace") {
      setForm({
        ...form,
        FromPlace: address.address,
        FromPlaceTag: address.tag,
      });
      setFromPlaceFound(null);
    } else {
      setForm({ ...form, ToPlace: address.address, ToPlaceTag: address.tag });
      setToPlaceFound(null);
    }
  };

  return (
    <LoadingOverlay active={loading} spinner text={spinnerMsg}>
      <>
        <Navbar />
        <div className="p-2 2xl:px-8 2xl:w-9/12 mx-auto">
          <div className="text-neutral-900 text-2xl 2xl:text-3xl font-semibold mb-2 2xl:mb-4">
            Create new log
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-row gap-4 px-2 justify-start items-center">
              <input
                className="text-xl scale-150"
                type="checkbox"
                id="autofill"
                name="autofill"
                value="autofill"
                onChange={(e) => {
                  setAutofill((current) => !current);
                }}
              />
              <label htmlFor="autofill" className="text-2xl font-semibold">
                Autofill with Proof
              </label>
            </div>

            <div className="w-full flex flex-col gap-2 tracking-wider">
              <label className="text-md text-neutral-700">
                Upload Ticket, Receipt
                <br />
                *File size should be lesser than 5MB
              </label>

              <label className="bg-blue-primary hover:bg-indigo-dark text-white font-bold p-3 w-full inline-flex justify-center cursor-pointer">
                <Image src={uploadImg} className="h-6 w-auto mr-4" alt="" />
                <input
                  type="file"
                  name="file"
                  required
                  onChange={handleFileChange}
                />
              </label>
              {uploadError && <p className="text-red-500">{uploadError}</p>}
              {file && (
                <div className="mt-4">
                  <p>File selected: {file.name}</p>
                 
                    <button
                      onClick={handleFilePreview}
                      className="bg-blue-primary text-white font-bold p-3 rounded cursor-pointer"
                    >
                      {showPreview ? "Hide Preview X" : "Show Preview"}
                    </button>
                  
                  {showPreview && (
                    <div className="mt-2">
                      {file.type === "application/pdf" ? (
                        // Render PDF preview
                        <embed
                          src={previewUrl}
                          type="application/pdf"
                          width="100%"
                          height="500px"
                        />
                      ) : (
                        // Render image preview
                        <img
                          src={previewUrl}
                          alt="File preview"
                          style={{ maxWidth: "100%", maxHeight: "500px" }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">
                Travelled From :{" "}
                <span className="capitalize font-semibold">
                  {form.FromPlaceTag}
                </span>{" "}
              </label>
              <input
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg"
                type="text"
                required
                name="FromPlace"
                onChange={handleInputChange}
                value={form.FromPlace}
              />
            </div>
            {fromPlaceFound != null && (
              <div className="flex border-2 border-blue-300 bg-blue-50 shadow-xl p-2 rounded-md flex-row justify-between items-center w-full  gap-2">
                <div className="text w-10/12 flex flex-col gap-2 items-start">
                  <div className="text-xl font-semibold text-blue-primary capitalize">
                    Saved Address Found :
                  </div>
                  <div className="text-xl font-semibold capitalize">
                    {fromPlaceFound.tag}
                  </div>
                  <div className=""> {fromPlaceFound.address} </div>
                </div>
                <button
                  onClick={() =>
                    handleSavedAddressSelect(fromPlaceFound, "FromPlace")
                  }
                  className="p-4 py-2 jus rounded-md text-center text-white bg-blue-primary cursor-pointer w-3/12"
                >
                  Select
                </button>
              </div>
            )}
            <div className="w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">
                Travelled To :{" "}
                <span className="capitalize font-semibold">
                  {form.ToPlaceTag}
                </span>{" "}
              </label>
              <input
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg"
                type="text"
                required
                name="ToPlace"
                onChange={handleInputChange}
                value={form.ToPlace}
              />
            </div>
            {toPlaceFound != null && (
              <div className="flex border-2 border-blue-300 bg-blue-50 shadow-xl p-2 rounded-md flex-row justify-between items-center w-full  gap-2">
                <div className="text w-10/12 flex flex-col gap-2 items-start">
                  <div className="text-xl font-semibold text-blue-primary capitalize">
                    Saved Address Found :
                  </div>
                  <div className="text-xl font-semibold capitalize">
                    {toPlaceFound.tag}
                  </div>
                  <div className=""> {toPlaceFound.address} </div>
                </div>
                <button
                  onClick={() =>
                    handleSavedAddressSelect(toPlaceFound, "ToPlace")
                  }
                  className="p-4 py-2 jus rounded-md text-center text-white bg-blue-primary cursor-pointer w-3/12"
                >
                  Select
                </button>
              </div>
            )}
            <div className="flex flex-row justify-between items-center gap-6">
              <div className="w-1/2 flex flex-col gap-2 tracking-wider">
                <label className="text-lg text-neutral-700">
                  Mode of Travel
                </label>
                <select
                  className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 text-lg"
                  placeholder="Enter your password..."
                  type="text"
                  name="TravelMode"
                  required
                  onChange={handleInputChange}
                  value={form.TravelMode}
                >
                  <option value="select travel mode">Select Travel Mode</option>
                  <option value="flight">Flight</option>
                  <option value="cab">Cab</option>
                  <option value="bus/auto">Bus/Auto/Public Transport</option>
                </select>
              </div>
              <div className="w-1/2 flex flex-col gap-2 tracking-wider">
                <label className="text-lg text-neutral-700">
                  Distance (in km)
                </label>
                <input
                  type="number"
                  className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg"
                  name="DistanceTraveled"
                  onChange={handleInputChange}
                  value={form.DistanceTraveled}
                />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center gap-6">
              <div className="w-1/2 flex flex-col gap-2 tracking-wider">
                <label className="text-lg text-neutral-700">
                  Date of Travel
                </label>
                <input
                  type="date"
                  className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg"
                  name="DateOfTravel"
                  onChange={handleInputChange}
                  value={form.DateOfTravel}
                />
              </div>
              <div className="w-1/2 flex flex-col gap-2 tracking-wider">
                <label className="text-lg text-neutral-700">
                  Travel Purpose
                </label>
                <select
                  className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 text-lg"
                  placeholder="Enter your password..."
                  type="text"
                  name="PurposeOfTravel"
                  onChange={handleInputChange}
                  value={defaultTravelPurpose}
                >
                  <option value="select travel purpose" disabled>
                    Select Travel Purpose
                  </option>
                  <option value="Daily Commute">Daily Commute</option>
                  <option value="Business Visit">Business Visit</option>
                </select>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center gap-6">
              <div className="w-full flex flex-col gap-2 tracking-wider">
                <label className="text-lg text-neutral-700">
                  Expense in INR
                </label>
                <input
                  type="number"
                  className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg"
                  name="ExpensesIncurred"
                  onChange={handleInputChange}
                  value={form.ExpensesIncurred}
                />
              </div>
              <div className="w-full flex flex-col gap-2 tracking-wider">
                <label className="text-lg text-neutral-700">Payment Mode</label>
                <select
                  className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 text-lg"
                  placeholder="Enter your password..."
                  type="text"
                  name="PaymentMode"
                  onChange={handleInputChange}
                  value={defaultPaymentMode}
                >
                  <option value="select payment mode" disabled>
                    Select Payment Mode
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Corporate CC">Corporate Credit Card</option>
                </select>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">
                Comments (if any)
              </label>
              <input
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg"
                name="Comments"
                onChange={handleInputChange}
              />
            </div>
            <button
              className="bg-blue-primary flex justify-center items-center px-6 py-4 rounded-md gap-4 text-white font-semibold text-2xl"
              onClick={handleFormSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </>
    </LoadingOverlay>
  );
};

export default YourPage;
