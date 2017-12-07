import React, {Component} from 'react';

import './App.css';
import {HashRouter, Route, Switch} from "react-router-dom";
// Componenets
import FileOutput from './Components/FileOutput'
import Search from "./Components/Search";

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
                    <Switch>
                        <Route exact path="/"
                               render={(props) => ( <Search {...props}/> )}/>
                        <Route path="/"
                               render={(props) => ( <FileOutput {...props} /> )}/>
                    </Switch>

            </HashRouter>
        );
    }
}

export default App;
