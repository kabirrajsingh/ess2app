import Image from "next/image";
import deletebinImg from "../assets/deletebin.png";
const Notification = (props) => {
  const fixed = props.fixed;

  return (
    <div
      className={`px-4 py-2 flex flex-row justify-between items-center ${
        fixed ? "bg-neutral-200" : "bg-blue-100"
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="text-base font-bold text-neutral-700">
          Log ID : 9253
        </div>
        <div>Kolkata to Bengaluru : &#8377; 6500 </div>
        <div className="flex flex-row justify-between items-center gap-4">
          {!fixed && <div class="w-4 h-4 bg-blue-primary rounded-full"></div>}
          {fixed ? (
            <div>No action required</div>
          ) : (
            <div>Missing or Incorrect field values</div>
          )}
        </div>
      </div>
      {fixed && (
        <div>
          <button className="cursor-pointer p-1">
            <Image alt="" src={deletebinImg} className="h-8 w-auto" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
