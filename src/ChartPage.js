import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import React, { useState } from 'react'
import Select from 'react-select'
import { useEffect } from 'react';
import DataEmptyLabel from './DataEmptyLabel';
import moment from 'moment'
import constants from './constants/constants';

const ChartPage = ({ defaultData, mutableData, selectedStartDate, selectedEndDate }) => {

    const [selectedCountry, setSelectedCountry] = useState('') //value: 'AF', label: 'Afghanistan'
    const [countryOptions, setCountryOptions] = useState(null);
    const [dataForChart, setDataForChart] = useState(null);
    const [selectedOldEndDate, setSelectedOldEndDate] = useState(selectedEndDate);
    const [selectedOldStartDate, setSelectedStartDate] = useState(selectedStartDate);

    const changeHandler = value => {
        setSelectedCountry(value)
        setNewDataForChartByCountryCode(value.value);
    }

    useEffect(() => {
        if (mutableData)
            setCountryOptions(getCountryList(mutableData));
        else
            setCountryOptions(getCountryList(defaultData));
    }, []);

    useEffect(() => {
        if (selectedOldEndDate !== selectedEndDate || selectedOldStartDate !== selectedEndDate) {
            setNewDataForChartByCountryCode(selectedCountry.value);
            setSelectedOldEndDate(selectedEndDate);
            setSelectedStartDate(selectedStartDate);
        }

    }, [selectedStartDate, selectedEndDate]);


    useEffect(() => {
        if (mutableData) {

            // check if all filters was reset
            if (mutableData.length === defaultData.length) {
                const countries = getCountryList(defaultData);
                setSelectedCountry('');
                setCountryOptions(countries);
                setDataForChart(null);
                return;
            }

            const countries = getCountryList(mutableData);
            // check if after mutableData change selected country still is valid
            if (!countries.some(country => country.value === selectedCountry?.value)) {
                setSelectedCountry('');
                setDataForChart(null);
            }
            else
                setSelectedCountry(selectedCountry);

            setCountryOptions(countries);
        }
    }, [mutableData]);


    function getCountryList(data) {
        let countriesCodesToBeFilteredFor = new Set();
        let countryNamesToBeFilteredFor = new Set();
        for (const record of data) {
            countriesCodesToBeFilteredFor.add(record.countryGeoId);
            countryNamesToBeFilteredFor.add(record.countryName);
        }
        countriesCodesToBeFilteredFor = [...countriesCodesToBeFilteredFor];
        countryNamesToBeFilteredFor = [...countryNamesToBeFilteredFor]
        let newCountryOptions = [];
        for (let i = 0; i < countriesCodesToBeFilteredFor.length; i++) {
            newCountryOptions.push({
                value: countriesCodesToBeFilteredFor[i],
                label: countryNamesToBeFilteredFor[i]
            });
        }

        return newCountryOptions;

    }

    function setNewDataForChartByCountryCode(countryCode) {
        if (!countryCode)
            return;
        let newChartData = [];
        if (mutableData)
            newChartData = getDataForChart(mutableData, countryCode);
        else
            newChartData = getDataForChart(defaultData, countryCode);

        setDataForChart(newChartData);
    }

    function getDataForChart(data, countryCode) {
        return data.filter((record) => {
            return record.countryGeoId === countryCode && (record.date >= selectedStartDate && record.date <= selectedEndDate);
        })
            .sort((x, y) => { return x.date - y.date })
            .map(((sortedResult) => {
                return {
                    date: moment(sortedResult.date).format(constants.DATE_FORMAT.toUpperCase()),
                    deaths: sortedResult.deaths,
                    cases: sortedResult.cases
                }
            }));
    }

    return (
        <div className='chart-page-container'>
            <div className='page-navbar-container'>
                <h1>Выбери страну </h1>
                <Select options={countryOptions} value={selectedCountry} onChange={changeHandler} />
            </div>
            <div className='chart-container'>
                {(dataForChart?.length === 0 || dataForChart === null) && <DataEmptyLabel />}
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
                        <Line type="monotone" dataKey="deaths" stroke="red" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartPage;