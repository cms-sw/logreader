import React, {Component} from 'react';

import './App.css';
import $ from 'jquery'
import {HashRouter, Route, Switch} from "react-router-dom";
// Componenets
import Layout from './Components/Layout'

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

    componentWillMount() {
        $.ajax({
            url: process.env.PUBLIC_URL + '/data/level1/level2/thread.log',
            dataType: 'text',
            cache: false,
            success: function (data) {
                this.setState({file: data}, function () {
                })
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    }


    render() {
        // if (!this.state.structure) {
        //     return <div></div>
        // }

        return (
            // TODO component to get link from
            <HashRouter>
                <div className={"container"}>
                    <h1>{this.state.fileName}</h1>

                    <Switch>
                        <Route exact path="/"
                               render={(props) => ( <div>cia bus paieska</div> )}/>
                        <Route path="/"
                               render={(props) => ( <Layout {...props} file={this.state.file}/> )}/>
                    </Switch>

                </div>
            </HashRouter>
        );
    }
}

export default App;
