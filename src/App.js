import './App.css';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataPickerNavbar from './DataPickerNavbar';
import { useState } from 'react';

function App() {
  const allowedStartDate = new Date("2023-03-01");
  const allowedEndDate = new Date("2023-03-31");

  const [startRangeDate, setStartRangeDate] = useState(allowedStartDate);
  const [endRangeDate, setEndRangeDate] = useState(allowedEndDate);

  function handleStartDateChange(date){
    setStartRangeDate(date);
  }

  function handleEndDateChange(date){
    setEndRangeDate(date);
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
        <Tab eventKey="home" title="Home">
          <p>Tab one</p>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <p>Tab two</p>
        </Tab>
      </Tabs>
      {startRangeDate.toDateString()}
      <br></br>
      {endRangeDate.toDateString()}
    </Form>
  );
}

export default App;
