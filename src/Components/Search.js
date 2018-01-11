import React, {Component} from 'react';
import {Button, ControlLabel, Form, FormControl, FormGroup, Row} from "react-bootstrap";
import Col from "react-bootstrap/es/Col";

// This class gets data
class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    // componentWillMount() {
    // }

    // componentWillReceiveProps(newProps) {
    // }

    // componentDidMount() {
    // };

    // componentDidUpdate() {
    // }

    onUpdateProp(propName) {
        const onChange = function (e) {
            this.state[propName] = e.target.value;
        }.bind(this);
        return onChange;
    }

    onSubmit = (e) => {
        e.preventDefault();
        let link = this.state.linkToFile;
        if (this.state.lineStart) {
            link += "#" + this.state.lineStart;
        }
        if (this.state.lineEnd){
            link += "-" + this.state.lineEnd;
        }
        this.props.history.push(link)
    };

    render() {
        return (
            <Row>
                <Col xs={11}>
                    <Form horizontal onSubmit={this.onSubmit}>
                        <FormGroup controlId="linkToFile">
                            <Col componentClass={ControlLabel} sm={2}>
                                Link to file
                            </Col>
                            <Col sm={10}>
                                <FormControl placeholder="link/to/file.txt" onChange={this.onUpdateProp("linkToFile")}/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="lineStart">
                            <Col componentClass={ControlLabel} sm={2}>
                                Line from
                            </Col>
                            <Col sm={1}>
                                <FormControl type="number" placeholder="ex. 0"
                                             onChange={this.onUpdateProp("lineStart")}/>
                            </Col>

                        </FormGroup>
                        <FormGroup controlId="lineStart">
                            <Col componentClass={ControlLabel} sm={2}>
                                Line to
                            </Col>
                            <Col sm={1}>
                                <FormControl type="number" placeholder="ex. 5" onChange={this.onUpdateProp("lineEnd")}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button type="submit">
                                    Go
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>

                </Col>
            </Row>
        )
    }
}

export default Search;
