import './App.css';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataPickerNavbar from './DataPickerNavbar';
import { useState, useEffect  } from 'react';
import ChartPage from './ChartPage';
import constants from './constants/constants';

const moment = require('moment');

function App() {
  const allowedStartDate = new Date("2023-03-01");
  const allowedEndDate = new Date("2023-03-31");



  const [startRangeDate, setStartRangeDate] = useState(allowedStartDate);
  const [endRangeDate, setEndRangeDate] = useState(allowedEndDate);


  const [covidStatistics, setCovidStatistics] = useState(null);
  function handleStartDateChange(date){
    setStartRangeDate(date);
  }

  function handleEndDateChange(date){
    setEndRangeDate(date);
  }

  function foo() {
    if(covidStatistics){
      const startDate = findStartDateOfRecords(covidStatistics);
      console.log('startDate',startDate);
    }
  }
  useEffect(() => {
    fetch(constants.URL_OF_COVID_CASES)
    .then( res =>{ return res.json();})
    .then(data => {
     setCovidStatistics(data.records);
     const startDate = findStartDateOfRecords(data.records);
     setStartRangeDate( startDate);
     const endDate = findEndDateOfRecords(data.records);
     setEndRangeDate( endDate);
    });
  }, []);
  
  function findEndDateOfRecords(data){
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

  function findStartDateOfRecords(data){
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

      <DataPickerNavbar 
        allowedStartDate={ allowedStartDate }
        allowedEndDate={ allowedEndDate }  
        handleStartDateChange = {handleStartDateChange} 
        handleEndDateChange = {handleEndDateChange} 
      />

      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Таблица">
          <ChartPage/>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <p>Tab two</p>
        </Tab>
      </Tabs>
      {startRangeDate.toDateString()}
      <br></br>
      {endRangeDate.toDateString()}
      <br></br>
    </Form>
  );
}

export default App;
