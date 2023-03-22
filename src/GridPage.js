
import DataTable from 'react-data-table-component';
//import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';

import searchIcon from './assets/icons/search.svg';

import React, { useState, useEffect } from 'react'

import filterBy from './enums/filter-by-enum';

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Helpers from './helpers/helpers';
import Toast from './helpers/toast-helper';


const columns = [
    {
        id: 'country',
        name: 'Страна',
        selector: row => row.countryName,
        sortable: true,
    },
    {
        id: 'cases',
        name: 'Количество случиев',
        selector: row => row.cases,
        sortable: true,
    },
    {
        id: 'deaths',
        name: 'Количество Смертей',
        selector: row => row.deaths,
        sortable: true,
    },
    {
        id: 'casesTotal',
        name: 'Количество случиев Всего',
        selector: row => row.casesAll,
        sortable: true,
    },
    {
        id: 'deathsTotal',
        name: 'Количество смертей Всего',
        selector: row => row.deathsAll,
        sortable: true,
    },
    {
        id: 'casesPerThousand',
        name: 'Количество случаев на 1к жителей',
        selector: row => row.casesOnThousandPeople,
        sortable: true,
    },
    {
        id: 'deathsPerThousand',
        name: 'Количество смертей на 1к жителей',
        selector: row => row.deathsOnThousandPeople,
        sortable: true,
    },
];


const GridPage = ({ data, selectedStartDate, selectedEndDate }) => {

    const [defaultGridData, setDefaultGridData] = useState([]);
    const [gridData, setGridData] = useState([]);
    const [countriesNames, setCountriesNames] = useState(null);

    const [selectedOldEndDate, setSelectedOldEndDate] = useState(selectedEndDate);
    const [selectedOldStartDate, setSelectedStartDate] = useState(selectedStartDate);

    const [countryFilterInput, setCountryFilterInput] = useState('');

    const [filterFrom, setFilterFrom] = useState('');
    const [filterTo, setFilterTo] = useState('');

    useEffect(() => {
        const countryCodes = new Set();
        const countryNames = new Set();
        for (const record of data) {
            countryCodes.add(record.geoId);
            countryNames.add(record.countriesAndTerritories.split('_').join(' '));
        }
        setCountriesNames(countryNames);
        let dict = {};
        for (const countryCode of countryCodes) {
            dict[countryCode] = data.filter(record => { return record.geoId === countryCode });
        }

        let newGridData = [];
        for (const countryCode of countryCodes) {
            const casesTotal = findCasesAllForCountry(dict[countryCode]);
            const deathTotal = findDeathAllForCountry(dict[countryCode]);
            const population = dict[countryCode][0].popData2019;
            const casesOnThousandPeople = perThousandPeople(casesTotal, population);
            const deathsOnThousandPeople = perThousandPeople(deathTotal, population);


            newGridData = newGridData.concat(dict[countryCode].map(record => {
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
        setDefaultGridData(newGridData);

        newGridData = newGridData.filter(record =>{return record.date >= selectedStartDate && record.date <= selectedEndDate})
        setGridData(newGridData)

    }, []);

    useEffect(() => {
        if(selectedOldEndDate!==selectedEndDate || selectedOldStartDate!==selectedStartDate){
            const newGridData = gridData.filter(record=>{
                return (record.date >= selectedStartDate && record.date <= selectedEndDate);
            });
            setSelectedOldEndDate(selectedEndDate);
            setSelectedStartDate(selectedStartDate);

            setGridData(newGridData);
        }
    },[selectedStartDate, selectedEndDate]);

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

    /*Filters data in grid using for that objectkey as key for property */
    function filterDataForGrid(Objectkey, filterFrom, filterTo) {
        if (defaultGridData[0][Objectkey]) {
            const newDataGrid = defaultGridData.filter(record => {
                return filterFrom <= record[Objectkey] && record[Objectkey] <= filterTo;
            })
            setGridData(newDataGrid);
        } else {
            throw Error('Objectkey does not belongs to object containing in defaultGridData array');
        }
    }

    function handleFilteringClick(filteringEnum) {
        switch (filteringEnum) {
            case filterBy.Country: {
                if (!countriesNames.has(filterFrom)) {
                    Toast.errorToastWithMessage(`Ведёное название страны в поле ОТ "${filterFrom}" не существует`);
                    return;
                }

                if (!countriesNames.has(filterTo)) {
                    Toast.errorToastWithMessage(`Ведёное название страны в поле ДО "${filterTo}" не существует`);
                    return;
                }

                filterDataForGrid('countryName', filterFrom, filterTo);

                break;
            }
            case filterBy.Cases: {
                /* TODO: figure out what to do with cases when number is float*/

                if (!Helpers.isNumeric(filterFrom)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ОТ "${filterFrom}" не являеться числом`);
                    return;
                }

                if (!Helpers.isNumeric(filterTo)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ДО "${filterTo}" не являеться числом`);
                    return;
                }

                filterDataForGrid('cases', filterFrom, filterTo)

                break;
            }
            case filterBy.Deaths: {

                /* TODO: figure out what to do with cases when number is float*/

                if (!Helpers.isNumeric(filterFrom)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ОТ "${filterFrom}" не являеться числом`);
                    return;
                }

                if (!Helpers.isNumeric(filterTo)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ДО "${filterTo}" не являеться числом`);
                    return;
                }

                filterDataForGrid('deaths', filterFrom, filterTo)

                break;
            }
            case filterBy.TotalCases: {

                /* TODO: figure out what to do with cases when number is float*/

                if (!Helpers.isNumeric(filterFrom)) {
                    Helpers.errorToastWithMessage(`Ведёное значение в поле ОТ "${filterFrom}" не являеться числом`);
                    return;
                }

                if (!Helpers.isNumeric(filterTo)) {
                    Helpers.errorToastWithMessage(`Ведёное значение в поле ДО "${filterTo}" не являеться числом`);
                    return;
                }

                filterDataForGrid('casesAll', filterFrom, filterTo)

                break;
            }
            case filterBy.TotalDeaths: {

                /* TODO: figure out what to do with cases when number is float*/

                if (!Helpers.isNumeric(filterFrom)) {
                    Helpers.errorToastWithMessage(`Ведёное значение в поле ОТ "${filterFrom}" не являеться числом`);
                    return;
                }

                if (!Helpers.isNumeric(filterTo)) {
                    Helpers.errorToastWithMessage(`Ведёное значение в поле ДО "${filterTo}" не являеться числом`);
                    return;
                }

                filterDataForGrid('deathsAll', filterFrom, filterTo)

                break;
            }
            case filterBy.CasesPerThousand: {
                if (!Helpers.isNumeric(filterFrom)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ОТ "${filterFrom}" не являеться числом`);
                    return;
                }

                if (!Helpers.isNumeric(filterTo)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ДО "${filterTo}" не являеться числом`);
                    return;
                }

                filterDataForGrid('casesOnThousandPeople', parseFloat(filterFrom), parseFloat(filterTo));
                break;
            }  
            case filterBy.DeathsPerThousand: {
                if (!Helpers.isNumeric(filterFrom)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ОТ "${filterFrom}" не являеться числом`);
                    return;
                }

                if (!Helpers.isNumeric(filterTo)) {
                    Toast.errorToastWithMessage(`Ведёное значение в поле ДО "${filterTo}" не являеться числом`);
                    return;
                }

                filterDataForGrid('deathsOnThousandPeople', parseFloat(filterFrom), parseFloat(filterTo));
                break;
            }
            default:
                throw Error('wrong enum input');
        }
    }

    function handleResetFilters() {
        setGridData(defaultGridData.filter(record =>{return record.date >= selectedStartDate && record.date <= selectedEndDate}));
        setCountryFilterInput('');
        setFilterFrom('');
        setFilterTo('');
    }

    function handleCountryFilterInput(event) {
        const filterText = event.target.value;

        setCountryFilterInput(filterText);
        const newGridData = defaultGridData.filter(record => {
            return record.countryName && record.countryName.toLowerCase().includes(filterText.toLowerCase());
        });

        setGridData(newGridData);
    }

    function handleFilterFrom(event) {
        const filterText = event.target.value;
        setFilterFrom(filterText);
    }

    function handleFilterTo(event) {
        const filterText = event.target.value;
        setFilterTo(filterText);
    }

    return (
        <div className='grid-page-container'>
            <ToastContainer />
            <div className='grid-menu-bar'>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Поиск страны"
                                onChange={handleCountryFilterInput}
                                value={countryFilterInput}
                            />
                            <InputGroup.Text >
                                <img className='icon' src={searchIcon} aria-hidden="true" alt="search icon" />
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle
                                className="w-100"
                                variant="success"
                            >
                                Фильтровать по полю...
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                className="w-auto"
                                drop="down-centered"
                            >
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.Country)}>Страна</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.Cases)}>Количество случиев</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.Deaths)}>Количество Смертей</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.TotalCases)}>Количество случиев Всего</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.TotalDeaths)}>Количество смертей Всего</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.CasesPerThousand)}>Количество случаев на 1к жителей</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleFilteringClick(filterBy.DeathsPerThousand)}>Количество смертей на 1к жителей</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <div className="grid-input-range-fields-container">
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="input"
                                    placeholder="ОТ"
                                    onChange={handleFilterFrom}
                                    value={filterFrom}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 ms-3" >
                                <Form.Control
                                    type="input"
                                    placeholder="ДО"
                                    onChange={handleFilterTo}
                                    value={filterTo}
                                />
                            </Form.Group>
                        </div>
                    </Col>
                </Row>

                <div className='d-flex flex-row-reverse'>
                    <Button onClick={handleResetFilters}> Сбросить фильтры </Button>
                </div>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={gridData}
                    pagination
                    persistTableHead
                />
            </div>
        </div>
    );
}

export default GridPage;