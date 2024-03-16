import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const formatDate = (date) => {
    return date ? date.toISOString().split('T')[0] : null;
  };

  return (
    <div className='flex flex-col gap-1'>
        <strong> You can import logs only upto previous 30 days. Logs older than that need to be added manually.</strong>
        <br/>
      <DatePicker
      className='border-2 border-blue-primary rounded-md p-2'
        selectsRange
        startDate={startDate ? new Date(startDate) : null}
        endDate={endDate ? new Date(endDate) : null}
        onChange={(dates) => {
          if (Array.isArray(dates) && dates.length === 2) {
            const [start, end] = dates;
            setStartDate(formatDate(start));
            setEndDate(formatDate(end));
          }
        }}
        placeholderText="Select date range"
        minDate={new Date().setDate(new Date().getDate() - 230)} 
        maxDate={new Date()} 
      />
    </div>
  );
};

export default DateRangePicker;