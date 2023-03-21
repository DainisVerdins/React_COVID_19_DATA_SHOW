
import DataTable from 'react-data-table-component-with-filter';
import FilterComponent from 'react-data-table-component-with-filter'
import Button from 'react-bootstrap/Button';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';

import searchIcon from './assets/icons/search.svg';

import React, { useState, useEffect } from 'react'

import sortBy from './enums/sort-by-enum';

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

    const [formatedData, setFormatedData] = useState([]);//is dictionary key-> country code : value-> array of records of that country
    const [gridData, setGridData] = useState([]);
    const [countryCodes, setCountryCodes] = useState(null);

    useEffect(() => {
        const countryCodes = new Set();
        for (const record of data) {
            countryCodes.add(record.geoId);
        }
        let dict = {};
        for (const countryCode of countryCodes) {
            dict[countryCode] = data.filter(record => { return record.geoId === countryCode });
        }

        setFormatedData(dict);
        setCountryCodes(countryCodes);

        let newGridData = [];
        for (const countryCode of countryCodes) {
            const casesTotal = findCasesAllForCountry(dict[countryCode]);
            const deathTotal = findDeathAllForCountry(dict[countryCode]);
            const population = dict[countryCode][0].popData2019;
            const casesOnThousandPeople = perThousandPeople(casesTotal, population);
            const deathsOnThousandPeople = perThousandPeople(deathTotal, population);


            newGridData = newGridData.concat(dict[countryCode].map(record => {
                return {
                    countryName: record.countriesAndTerritories.split('_').join(' '),
                    cases: record.cases,
                    deaths: record.deaths,
                    casesAll: casesTotal,
                    deathsAll: deathTotal,
                    casesOnThousandPeople: casesOnThousandPeople,
                    deathsOnThousandPeople: deathsOnThousandPeople,
                }
            }));
        }

        console.log(newGridData);
        setGridData(newGridData);

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


    function handleSortingClick(sortingEnum) {
        switch (sortingEnum) {
            case sortBy.Country:

                break;
            case sortBy.Cases:

                break;
            case sortBy.Cases:

                break;
            case sortBy.Deaths:

                break;
            case sortBy.TotalCases:

                break;
            case sortBy.TotalDeaths:

                break;

            case sortBy.TotalDeaths:

                break;

            case sortBy.CasesPerThousand:

                break;

            case sortBy.DeathsPerThousand:

                break;
            default:
                throw Error('wrong enum input');
        }
    }


    return (
        <div className='grid-page-container'>
            <div className='grid-menu-bar'>
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Поиск страны"
                            />
                            <Button variant="outline-secondary" >
                                <img className='icon' src={searchIcon} aria-hidden="true" alt="search icon" />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle className="w-100" variant="success" id="dropdown-basic">
                                Фильтровать по полю...
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="w-100 ">
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.Country)}>Страна</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.Cases)}>Количество случиев</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.Deaths)}>Количество Смертей</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.TotalCases)}>Количество случиев Всего</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.TotalDeaths)}>Количество смертей Всего</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.CasesPerThousand)}>Количество случаев на 1к жителей</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleSortingClick(sortBy.DeathsPerThousand)}>Количество смертей на 1к жителей</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </Col>
                    <Col>
                        <div className="grid-input-range-fields-container">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="input" placeholder="ОТ" />
                            </Form.Group>
                            <Form.Group className="mb-3 ms-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="input" placeholder="ДО" />
                            </Form.Group>
                        </div>
                    </Col>
                </Row>

                <div className='d-flex flex-row-reverse'>
                    <Button> Сбросить фильтры </Button>
                </div>
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={gridData}
                    pagination
			        persistTableHead
                >
                   
                </DataTable>
            </div>
        </div>
    );
}

export default GridPage;