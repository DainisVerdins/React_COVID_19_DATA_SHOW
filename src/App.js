import './App.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataPickerNavbar from './DataPickerNavbar';
import { useState, useEffect } from 'react';
import ChartPage from './ChartPage';
import constants from './constants/constants';
import GridPage from './GridPage';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [defaultData, setDefaultData] = useState(null); // stores in self data array what contains all records in specific manner
  const [mutableData, setMutableData] = useState(null);// data what will change in grid filters or by date picker

  const [isLoaded, setIsLoaded] = useState(false);


  function handleStartDateChange(date) {
    setSelectedStartDate(date);
  }

  function handleEndDateChange(date) {
    setSelectedEndDate(date);
  }

  function handleMutableDataChange(data){
    setMutableData(data);
  }

  useEffect(() => {
    fetch(constants.URL_OF_COVID_CASES)
      .then(res => { return res.json(); })
      .then(data => {
        const minDate = findMinDateOfRecords(data.records);
        setMinDate(minDate);
        setSelectedStartDate(minDate);

        const maxDate = findMaxDateOfRecords(data.records);
        setMaxDate(maxDate);

        setSelectedEndDate(maxDate);

        const countryCodes = new Set();
        const countryNames = new Set();
        for (const record of data.records) {
          countryCodes.add(record.geoId);
          countryNames.add(record.countriesAndTerritories.split('_').join(' '));
        }

        let dict = {};
        for (const countryCode of countryCodes) {
          dict[countryCode] = data.records.filter(record => { return record.geoId === countryCode });
        }

        let defaultData = [];
        for (const countryCode of countryCodes) {
          const casesTotal = findCasesAllForCountry(dict[countryCode]);
          const deathTotal = findDeathAllForCountry(dict[countryCode]);
          const population = dict[countryCode][0].popData2019;
          const casesOnThousandPeople = perThousandPeople(casesTotal, population);
          const deathsOnThousandPeople = perThousandPeople(deathTotal, population);


          defaultData = defaultData.concat(dict[countryCode].map(record => {
            return {
              countryGeoId: record.geoId,
              countryName: record.countriesAndTerritories.split('_').join(' '),
              cases: record.cases,
              deaths: record.deaths,
              casesAll: casesTotal,
              deathsAll: deathTotal,
              casesOnThousandPeople: casesOnThousandPeople,
              deathsOnThousandPeople: deathsOnThousandPeople,
              date: new Date(`${record.year}-${record.month}-${record.day}`)
            }
          }));
        }
        setDefaultData(defaultData);
        setIsLoaded(true);
      });
  }, []);

  function perThousandPeople(rate, totalPopulation) {
    return (1000 * (rate / totalPopulation)).toFixed(2);
  }

  function findCasesAllForCountry(countryData) {
    let output = 0;
    for (const record of countryData)
      output += record.cases;

    return output;
  }

  function findDeathAllForCountry(countryData) {
    let output = 0;
    for (const record of countryData)
      output += record.deaths;

    return output;
  }

  function findMaxDateOfRecords(data) {
    /*Assumed what data in array could not be sorted by date*/
    let endDate = new Date(`${data[0].year}-${data[0].month}-${data[0].day}`);
    console.log('asdfasdf', endDate);
    for (const record of data) {
      let recordDate = new Date(`${record.year}-${record.month}-${record.day}`);
      if (endDate < recordDate)
        endDate = recordDate;
    }
    return endDate;
  }

  function findMinDateOfRecords(data) {
    /*Assumed what data in array could not be sorted by date*/
    let startDate = new Date(`${data[0].year}-${data[0].month}-${data[0].day}`);
    for (const record of data) {
      let recordDate = new Date(`${record.year}-${record.month}-${record.day}`);
      if (startDate > recordDate)
        startDate = recordDate;
    }

    return startDate;
  }

  return (
    <div className="page">
      {(!isLoaded) && <Spinner animation="border" />}
      {isLoaded &&
        <DataPickerNavbar
          minDate={minDate}
          maxDate={maxDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          selectedEndDate={selectedEndDate}
          selectedStartDate={selectedStartDate}
        />
      }
      {isLoaded &&
        <Tabs
          defaultActiveKey="profile"
        >
          <Tab eventKey="home" title="Таблица">

            <GridPage
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              defaultData={defaultData}
              mutableData={mutableData}
              handleMutableDataChange={handleMutableDataChange}
            />

          </Tab>
          <Tab eventKey="profile" title="График">
             <ChartPage
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              defaultData={defaultData}
              mutableData={mutableData}
            />

          </Tab>
        </Tabs>
      }
    </div>
  );
}

export default App;
