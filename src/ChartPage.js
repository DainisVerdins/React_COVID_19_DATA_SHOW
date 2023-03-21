import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useEffect } from 'react';
import DataEmptyLabel from './DataEmptyLabel';
import constants from './constants/constants';
import moment from 'moment'

const ChartPage = ({ data, selectedStartDate, selectedEndDate }) => {

    const [country, setCountry] = useState('')
    const options = useMemo(() => countryList().getData(), [])
    const [dataForChart, setDataForChart] = useState(null);
    const [selectedOldEndDate, setSelectedOldEndDate] = useState(selectedEndDate);
    const [selectedOldStartDate, setSelectedStartDate] = useState(selectedStartDate);

    const changeHandler = value => {
        setCountry(value)
        setNewDataForChart(value.value);
    }

    useEffect(() => {
        if (!country)
            return;
        //if prop value changed remake chart
        if (selectedOldEndDate !== selectedEndDate) {
            setNewDataForChart(country.value);
            setSelectedOldEndDate(selectedEndDate);
        }
        if (selectedOldStartDate !== selectedEndDate) {
            setNewDataForChart(country.value);
            setSelectedStartDate(selectedStartDate);
        }

    }, [country, selectedStartDate, selectedEndDate, selectedOldStartDate, selectedOldEndDate]);

    function setNewDataForChart(countryCode) {
        if (!countryCode)
            return;

        const newChartData = data.filter((record) => {
            const recordDate = new Date(`${record.year}-${record.month}-${record.day}`);

            return record.geoId === countryCode && (recordDate >= selectedStartDate && recordDate <= selectedEndDate);
        })
        .sort((x, y) => { return new Date(`${x.year}-${x.month}-${x.day}`) - new Date(`${y.year}-${y.month}-${y.day}`); })
        .map(((sortedResult) => {
            return {
                date: moment(new Date(`${sortedResult.year}-${sortedResult.month}-${sortedResult.day}`)).format(constants.DATE_FORMAT.toUpperCase()),
                deaths: sortedResult.deaths,
                cases: sortedResult.cases
            }
        }));

        setDataForChart(newChartData);
    }


    return (
        <div className='chart-page-container'>
            <div className='page-navbar-container'>
                <h1>Выбери страну </h1>
                <Select options={options} value={country} onChange={changeHandler} />
            </div>
            <div className='chart-container'>
                { (dataForChart?.length===0 || dataForChart ===null) && <DataEmptyLabel/>}
                <ResponsiveContainer width="100%" height={400} >
                    <LineChart data={dataForChart}>
                        <CartesianGrid></CartesianGrid>
                        <XAxis
                            dataKey="date"
                            label={{ value: 'Периуд', position: 'insideBottomRight', offset: 0 }}

                            />
                        <YAxis
                            label={{ value: 'Случаи', angle: -90, position: 'insideLeft' }}
                            type="number" domain={['10', '20']}
                            />
                        <Tooltip> </Tooltip>
                        <Legend>Some Crap</Legend>
                        <Line type="monotone" dataKey="cases" stroke="green" />
                        <Line type="monotone" dataKey="deaths" stroke="red"  />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartPage;