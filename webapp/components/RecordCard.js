import Link from "next/link";
const RecordCard = ({ record }) => {
  return (

    <div className="flex flex-col px-2 py-1  mb-2 bg-slate-100 border-2 border-blue-primary rounded-lg p-4">
      <Link href={`/log/${record._id}`}>
      <div className="flex flex-row gap-2 justify-between items-center text-lg font-semibold w-full ">
        <div className="w-10/12 flex flex-col gap-2">
          <h1 className="capitalize"> <span className="text-blue-primary font-bold">From: </span> {record.FromPlaceTag  ? record.FromPlaceTag : record.FromPlace}</h1>
          <h1 className="capitalize"> <span  className="text-blue-primary font-bold">To: </span> {record.ToPlaceTag ? record.ToPlaceTag : record.ToPlace}</h1>
        </div>
        <div className="text-xl text-green-600 w-2/12" >&#8377; {record.ExpensesIncurred}</div>
      </div>
      <div className="flex flex-row justify-between items-center text-neutral-700">
        <div>Date: {new Date(record.DateOfTravel).toLocaleDateString()}</div>
        <div>Mode of Travel: {record.TravelMode}</div>
      </div>
      </Link>
    </div>
  );
};

export default RecordCard;