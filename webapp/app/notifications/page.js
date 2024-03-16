import Navbar from "../../components/Navbar";
import Notification from "../../components/Notification";
const page = () => {
  return (
    <>
      <Navbar />

      <h1 className="text-neutral-900 text-3xl font-semibold p-2">
        Notifications
      </h1>
      <div className="divide-y divide-slate-400 h-screen overflow-y-scroll">
        <Notification fixed={false} />
        <Notification fixed={true} />
        <Notification fixed={false} />
        <Notification fixed={false} />
      </div>
    </>
  );
};

export default page;
