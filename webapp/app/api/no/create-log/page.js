import Image from "next/image";
import uploadImg from "../../assets/upload.png";
import Navbar from "../../../../components/Navbar";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="p-2">
        <div className="text-neutral-900 text-2xl font-semibold mb-2">
          Create new log
        </div>
        <div className="flex flex-col gap-2">
          <div className=" w-full flex flex-col gap-2 tracking-wider">
            <label className="text-md text-neutral-700">
              Upload Ticket, Receipt
            </label>
            <button className="bg-blue-primary hover:bg-indigo-dark text-white font-bold p-3 w-full inline-flex justify-center">
              <Image alt="" src={uploadImg} className="h-6 w-auto mr-4" />
              <input
                className="cursor-pointer block pin"
                type="file"
                name="file"
                required
              />
            </button>
          </div>
          <div className=" w-full flex flex-col gap-2 tracking-wider">
            <label className="text-lg text-neutral-700">Travelled From</label>
            <input
              className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg "
              type="text"
              required
            />
          </div>
          <div className=" w-full flex flex-col gap-2 tracking-wider">
            <label className="text-lg text-neutral-700">Travelled To</label>
            <input className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg " 
            type="text"
            required />
          </div>
          <div className="flex flex-row justify-between items-center gap-6">
            <div className=" w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">Mode of Travel</label>
              <select
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 text-lg"
                placeholder="Enter your password..."
                type="text"
                name="genre"
                required
              >
                <option value="flight">Flight</option>
                <option value="Cab">Cab</option>
                <option value="bus/auto">Bus/Auto/Public Transport</option>
              </select>
            </div>
            <div className=" w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">
                {" "}
                Distance{" (in km)"}{" "}
              </label>
              <input
                type="number"
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg "
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center gap-6">
            <div className=" w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">Date of Travel</label>
              <input
                type="date"
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg "
              />
            </div>
            <div className=" w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">Travel Purpose</label>
              <select
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 text-lg"
                placeholder="Enter your password..."
                type="text"
                name="genre"
              >
                <option value="daily">Daily Commute</option>
                <option value="Business">Business Visit</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center gap-6">
            <div className=" w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">Expense in INR</label>
              <input
                type="number"
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg "
              />
            </div>
            <div className=" w-full flex flex-col gap-2 tracking-wider">
              <label className="text-lg text-neutral-700">Payment Mode</label>
              <select
                className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-800 text-lg"
                placeholder="Enter your password..."
                type="text"
                name="genre"
              >
                <option value="personal">Personal</option>
                <option value="corporate-creditcard">
                  Corporate Credit Card
                </option>
              </select>
            </div>
          </div>
          <div className=" w-full flex flex-col gap-2 tracking-wider">
            <label className="text-lg text-neutral-700">
              Comments {"(if any)"}
            </label>
            <input className="w-full border-2 h-10 border-blue-primary rounded px-4 text-neutral-900 text-lg " />
          </div>
          <button  className="bg-blue-primary flex justify-center items-center px-6 py-4 rounded-md gap-4 text-white font-semibold text-2xl">
          Save
        </button>
        </div>
      </div>
    </>
  );
};

export default page;
