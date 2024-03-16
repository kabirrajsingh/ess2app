const LastRecord = () => {
  return (
    <div className="flex flex-col px-2 py-1">
      <div className="flex flex-row justify-between items-center text-lg font-semibold">
        <div>
          <h1>From: Kolkata</h1>
          <h1>To: Bengaluru</h1>
        </div>
        <div className="text-2xl">&#8377; 6500</div>
      </div>
      <div className="flex flex-row justify-between items-center text-neutral-700">
        <div>Date: 16-10-2023</div>
        <div>Mode of Travel : Flight</div>
      </div>
    </div>
  );
};

export default LastRecord;
