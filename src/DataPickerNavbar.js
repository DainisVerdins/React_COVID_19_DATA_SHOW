import DatePicker, { registerLocale} from 'react-datepicker';
import Constants from './constants/constants'


import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ru from 'date-fns/locale/ru'; // set local to ru language
registerLocale('ru', ru);

// README: TODO: 
/* 
    1. Move locale to constants to change if needed
*/
const DataPickerNavbar = ({ minDate, maxDate, selectedStartDate, selectedEndDate, handleStartDateChange, handleEndDateChange }) => {
    return (
        <div className="data-picker-navbar-container">
            <Row className="align-items-start">
                <Col xl={6}>
                    <div className='data-picker-navbar-row'>
                    <div className="data-picker-navbar-element">
                        <h2> Период от </h2>
                    </div>
                    <div className="data-picker-navbar-element">
                        <DatePicker
                            dateFormat={Constants.DATE_FORMAT}
                            showIcon
                            selected={selectedStartDate || minDate}
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={(date) => handleStartDateChange(date)}
                            calendarStartDay={1} //sets datepicker week day one
                            locale='ru'
                        />
                    </div>
                    <div className="data-picker-navbar-element">
                        <h2> до </h2>
                    </div>
                    <div className="data-picker-navbar-element">
                        <DatePicker
                            dateFormat={Constants.DATE_FORMAT}
                            showIcon
                            selected={selectedEndDate || maxDate}
                            maxDate={maxDate}
                            minDate={minDate}
                            onChange={(date) => handleEndDateChange(date)}
                            calendarStartDay={1}//sets datepicker week day one
                            locale='ru'
                        />
                    </div>
                    </div>
                </Col>
            </Row>
        </div >
    );
}

export default DataPickerNavbar;