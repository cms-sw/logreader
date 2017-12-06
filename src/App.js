import React, {Component} from 'react';

import './App.css';
import {HashRouter, Route, Switch} from "react-router-dom";
// Componenets
import FileOutput from './Components/FileOutput'
import Search from "./Components/Search";
import CellMeasurerExample from "./Components/CellMeasurerExample";

//------------------------------------------
//      Main entry component
//------------------------------------------
class App extends Component {

    constructor() {
        super();
        this.state = {
            fileName: "Enter file name"
        }
    }

    render() {
        return (
            <HashRouter>
                <div className={"container"}>
                    <Switch>
                        <Route exact path="/"
                               render={(props) => ( <Search {...props}/> )}/>
                        <Route path="/"
                               render={(props) => ( <CellMeasurerExample {...props} /> )}/>
                    </Switch>

                </div>
            </HashRouter>
        );
    }
}

export default App;
