import DatePicker from 'react-datepicker';
import Constants from './constants/constants'


import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// README: TODO: 
/* 
    1. Make datapickers format local not only english
    2. Fix column problem for datapickers and text between them like it is in the task
*/
const DataPickerNavbar = ({minDate, maxDate, selectedStartDate, selectedEndDate, handleStartDateChange, handleEndDateChange}) => {
    return (
        <div className="data-picker-navbar-container">
            <Row className="align-items-start">
                <Col xl={6}>
                    <div>
                    <p> Период от </p>
                    </div>
                    <div>
                    <DatePicker
                        dateFormat={Constants.DATE_FORMAT}
                        showIcon
                        selected={selectedStartDate || minDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={(date) => handleStartDateChange(date)}
                        calendarStartDay={1} //sets datepicker week day one
                    />
                    </div>
                    <div>
                    <p> до </p>

                    </div>
                    <DatePicker
                        dateFormat={Constants.DATE_FORMAT}
                        showIcon
                        selected={selectedEndDate || maxDate}
                        maxDate={maxDate}
                        minDate={minDate}
                        onChange={(date) => handleEndDateChange(date)}
                        calendarStartDay={1}//sets datepicker week day one
                    />
                </Col>
            </Row>
        </div>
    );
}

export default DataPickerNavbar;