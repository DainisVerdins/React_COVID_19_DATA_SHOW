import './App.css';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataPickerNavbar from './DataPickerNavbar';
import { useState, useEffect  } from 'react';
import ChartPage from './ChartPage';
import constants from './constants/constants';

function App() {
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  const [selectedStartDate, setSelectedStartDate]= useState(null);
  const [selectedEndDate, setSelectedEndDate]= useState(null);

  const [covidStatistics, setCovidStatistics] = useState(null);


  function handleStartDateChange(date){
    setSelectedStartDate(date);
  }

  function handleEndDateChange(date){
    setSelectedEndDate(date);
  }

  useEffect(() => {
    fetch(constants.URL_OF_COVID_CASES)
    .then( res =>{ return res.json();})
    .then(data => {
     setCovidStatistics(data.records);
     const minDate = findMinDateOfRecords(data.records);
     setMinDate(minDate);
     setSelectedStartDate(minDate);
     const maxDate = findMaxDateOfRecords(data.records);
     setMaxDate(maxDate);
     setSelectedEndDate(maxDate);
    });
  }, []);
  
  function findMaxDateOfRecords(data) {
    /*Assumed what data in array could not be sorted by date*/
    let endDate=new Date(`${data[0].year}-${data[0].month}-${data[0].day}`);
    console.log('asdfasdf', endDate);
    for (const record of data) {
      let recordDate = new Date(`${record.year}-${record.month}-${record.day}`);
      if(endDate < recordDate)
        endDate = recordDate;
    }
    return endDate;
  }

  function findMinDateOfRecords(data){
    /*Assumed what data in array could not be sorted by date*/
    let startDate=new Date(`${data[0].year}-${data[0].month}-${data[0].day}`);
    for (const record of data) {
      let recordDate = new Date(`${record.year}-${record.month}-${record.day}`);
      if(startDate > recordDate)
        startDate = recordDate;
    }

    return startDate;
  }

  return (
    <Form className="page">
      { minDate && maxDate &&
      <DataPickerNavbar 
        minDate={ minDate }
        maxDate={ maxDate }  
        handleStartDateChange={ handleStartDateChange } 
        handleEndDateChange={ handleEndDateChange } 
        selectedEndDate = {selectedEndDate}
        selectedStartDate = {selectedStartDate}
      />
}

      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Таблица">
        { minDate && maxDate &&
          <ChartPage
            selectedStartDate={ selectedStartDate }
            selectedEndDate={ selectedEndDate } 
            data = {covidStatistics}
            />
        }
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <p>Tab two</p>
        </Tab>
      </Tabs>
      {minDate && minDate.toDateString()}
      <br></br>
      {maxDate && maxDate.toDateString()}
      <br></br>
      {selectedStartDate && selectedStartDate.toDateString()}
      <br></br>
      {selectedEndDate && selectedEndDate.toDateString()}
      <br></br>
    </Form>
  );
}

export default App;
