import React, {Component} from "react";
import uuid from 'uuid'
import {Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

class Controls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 100,
            fileConfig: props.fileConfig ? props.fileConfig : []
        }
    }

    // this function will
    getHeight() {
        const height = document.getElementById('control').clientHeight;
        if (this.state.height !== height) {
            this.setState({height});
            this.props.informHeight(height + 20);
        }
    }

    // called after first render
    componentDidMount() {
        this.getHeight();
    };

    // called after sequential render
    componentDidUpdate() {
        this.getHeight();
    };

    // called on updating properties
    componentWillReceiveProps(newProps) {
        if (newProps.fileConfig){
            let fileConfig = newProps.fileConfig;
            this.setState({fileConfig});
        } else {
            let fileConfig = [];
            this.setState({fileConfig});
        }
    }

    render() {
        return (
            <div id={"control"} style={{paddingTop: 10}}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Search</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav>
                        <p className={"navbar-text"}>
                            <b>Go to</b>
                        </p>
                        <NavDropdown title="Issues" id="basic-nav-dropdown">
                            {this.state.fileConfig.map(item => {
                                    return (
                                        <LinkContainer key={uuid.v4()} to={'/' + item.start}>
                                            <NavItem>{item.name}</NavItem>
                                        </LinkContainer>
                                    )
                                }
                            )}
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

export default Controls;
