import DatePicker from 'react-datepicker';
import Constants from './constants/constants'


import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// README: TODO: 
/* 
    1. Make datapickers format local not only english
    2. Fix column problem for datapickers and text between them like it is in the task
*/
const DataPickerNavbar = ({allowedStartDate, allowedEndDate, handleStartDateChange, handleEndDateChange}) => {
    return (
        <div className="data-picker-navbar-container">
            <Row className="align-items-start">
                <Col>
                    <p> Период от </p>
                </Col>
                <Col>
                    <DatePicker
                        dateFormat={Constants.DATE_FORMAT}
                        showIcon
                        selected={allowedStartDate}
                        minDate={allowedStartDate}
                        maxDate={allowedEndDate}
                        onChange={(date) => handleStartDateChange(date)}
                        calendarStartDay={1} //sets datepicker week day one
                    />
                </Col>
                <Col>
                    <p> до </p>
                </Col>
                <Col>
                    <DatePicker
                        dateFormat={Constants.DATE_FORMAT}
                        showIcon
                        selected={allowedEndDate}
                        maxDate={allowedEndDate}
                        minDate={allowedStartDate}
                        onChange={(date) => handleEndDateChange(date)}
                        calendarStartDay={1}//sets datepicker week day one
                    />
                </Col>
            </Row>
        </div>
    );
}

export default DataPickerNavbar;