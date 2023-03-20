import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useEffect } from 'react';

const datas = [
    {
        month: 'January',
        savings: 5000,
        loss: 500
    },
    {
        month: 'February',
        savings: 8000,
        loss: 300
    },
    {
        month: 'March',
        savings: 3000,
        loss: 800
    },
    {
        month: 'April',
        savings: 6000,
        loss: 100
    },
    {
        month: 'May',
        savings: 4000,
        loss: 700
    },
    {
        month: 'June',
        savings: 9000,
        loss: 1200
    },
]

/*
GeoId == country value
*/


const ChartPage = ({ data, selectedStartDate, selectedEndDate }) => {

    const [country, setCountry] = useState('')
    const options = useMemo(() => countryList().getData(), [])
    const [dataForChart, setDataForChart] = useState([]);
    const [selectedOldEndDate, setSelectedOldEndDate] = useState(selectedEndDate);
    const [selectedOldStartDate, setSelectedStartDate] = useState(selectedStartDate);

    const [fool, setFoo] = useState(data);

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

    }, [selectedStartDate, selectedEndDate]);


    function setNewDataForChart(countryCode) {
        if (!countryCode)
            return;

        const newChartData = fool.filter((record) => {
            const recordDate = new Date(`${record.year}-${record.month}-${record.day}`);

            return record.geoId === countryCode && (recordDate >= selectedStartDate && recordDate <= selectedEndDate);
        });
        setDataForChart(newChartData);
    }


    return (
        <div className='chart-page-container'>
            <div className='page-navbar-container'>
                <p>Выбери страну </p>
                <Select options={options} value={country} onChange={changeHandler} />
                {country.value}
            </div>
            <div className='graph-container'>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={datas}>
                        <CartesianGrid></CartesianGrid>
                        <XAxis dataKey="month"></XAxis>
                        <YAxis></YAxis>
                        <Tooltip> </Tooltip>
                        <Legend>Some Crap</Legend>
                        <Line type="monotone" dataKey="loss" stroke="green" />
                        <Line type="monotone" dataKey="savings" stroke="red" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartPage;