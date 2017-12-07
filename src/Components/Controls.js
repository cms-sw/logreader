import React, {Component} from "react";
import {Panel, PanelGroup} from "react-bootstrap";

class Controls extends Component {
    constructor(props) {
        super(props);
        this.state ={
            height : 100
        }
    }

    getHeight(){
        const height = document.getElementById('control').clientHeight;
        if (this.state.height !== height){
            this.setState({height})
            this.props.informHeight(height + 20); // TODO harcoded padding
        }
    }

    // called after first render
    componentDidMount() {
        this.getHeight()
    };

    // called after sequential render
    componentDidUpdate() {
        this.getHeight()
    }

    render() {
        return (
            <div id={"control"}>
                <PanelGroup>
                    <Panel collapsible header="Panel 1" eventKey="1">Panel 1 content</Panel>
                    <Panel collapsible header="Panel 2" eventKey="2">Panel 2 content</Panel>
                    <Panel collapsible header="Panel 3" eventKey="3">Panel 3 content</Panel>
                </PanelGroup>
            </div>

        );
    }
}

export default Controls;
