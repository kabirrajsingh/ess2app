
const DisplayDateRange = ({ startDate, endDate }) => {
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-CA', options);
    };
  
    return (
      <div>
        <div className='font-medium text-xl' >Selected Date Range:</div>
        {startDate && endDate ? (
          <p>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</p>
        ) : (
          <p>No date range selected</p>
        )}
      </div>
    );
  };
  
  export default DisplayDateRange;