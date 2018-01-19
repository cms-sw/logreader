import React, {Component} from "react";
import uuid from 'uuid'
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";

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
        if (newProps.fileConfig) {
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
                    <Nav>
                        <p className={"navbar-text"}>
                            <b>Go to</b>
                        </p>
                        <NavDropdown title="Issues" id="basic-nav-dropdown">
                            {this.state.fileConfig.map(item => {
                                    return (
                                        <MenuItem key={uuid.v4()}
                                                  href={this.props.pathName + "#" + item.lineStart + "-" + item.lineEnd}>{item.name}</MenuItem>
                                    )
                                }
                            )}
                        </NavDropdown>
                        <NavItem href={this.props.urlRaw}>
                            Get raw file
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        );
    }

}

export default Controls;
