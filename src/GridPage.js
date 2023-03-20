
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

const columns = [
    {
        name: 'Title',
        selector: row => row.title,
    },
    {
        name: 'Year',
        selector: row => row.year,
    },
];

const datas = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

const GridPage = ({ data, selectedStartDate, selectedEndDate }) => {
    return (
        <div className='grid-page-container'>
            <div className='grid-menu-bar'>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control type="input" placeholder="Поиск страны" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Row>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Dropdown Button
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Row>
                    </Col>
                    <Col>
                        <div className='classec'>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="input" placeholder="ОТ" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control type="input" placeholder="ДО" />
                            </Form.Group>
                        </div>
                    </Col>
                </Row>
                <div className='d-flex flex-row-reverse'>
                    <Button >Сбросить фильтры</Button>
                </div>
            </div>
            <div className>
                <DataTable
                    columns={columns}
                    data={datas} />
            </div>
        </div>
    );
}

export default GridPage;