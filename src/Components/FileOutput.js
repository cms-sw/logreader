import React, {Component} from 'react';
import {Button, Jumbotron, Panel, PanelGroup, Table} from "react-bootstrap";
import {HashLink as Link} from 'react-router-hash-link';
import uuid from 'uuid';
import InfiniteScroller from "./InfiniteScroller";
import Controls from "./Controls";

// This class gets data
class FileOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controlHeight: 100
        }
    }

    goToLine() {
        let number = this.getLinesNumbers()[0]; // get first line
        let elem = document.getElementById(number); //element to which to scroll.
        if (elem) {
            elem.scrollIntoView()
        }
    }

    requestFile(fileUrl) {
        fileUrl = fileUrl.substring(1);
        console.log(fileUrl);
        const object = this;
        fetch(fileUrl, {mode: 'cors'})
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.text().then(function (data) {
                        object.setState({file: data})
                        // console.log(data);
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });

    }


    getLinesNumbers() {
        let [lineStart, lineEnd] = this.props.location.hash.substring(1).split("-");
        lineStart = lineStart ? Number(lineStart) : undefined;
        lineEnd = lineEnd ? Number(lineEnd) : undefined;
        return [lineStart, lineEnd]
    }

    // called before first render
    componentWillMount() {
        // '/data/level1/level2/thread.log'
        this.requestFile(this.props.location.pathname);
    }

    // called on updating properties
    componentWillReceiveProps(newProps) {
        this.requestFile(newProps.location.pathname)

    }

    // called after first render
    componentDidMount() {
        // Scroll to element view
        this.goToLine();
    };

    // called after sequential render
    componentDidUpdate() {
        // Scroll to element view
        this.goToLine();
    }

    updateHeight(controlHeight) {
        this.setState({controlHeight});
    }

    render() {
        let text = this.state.file;
        const [lineStart, lineEnd] = this.getLinesNumbers();
        if (!text) {
            return <h3>Loading</h3>;
        }
        // return (
        //     <div>
        //         <h1></h1>
        //         <Table bordered={false} condensed={true} hover>
        //             <tbody>
        //             {text.split("\n").map((line, pos) => {
        //
        //                 // color selected lines
        //                 let rowClass = "textRow";
        //                 if (lineEnd) {
        //                     if (pos >= lineStart && pos <= lineEnd) {
        //                         rowClass += " success";
        //                     }
        //                 } else {
        //                     if (pos === lineStart) {
        //                         rowClass += " success";
        //                     }
        //                 }
        //
        //                 return (
        //                     <tr key={uuid.v4()} className={rowClass}>
        //                         <td className={"numberColumn"}>
        //                             <Link to={"#" + pos}>{pos}</Link>
        //                         </td>
        //                         <td className={"textColumn"} id={pos}>{line}</td>
        //                     </tr>
        //                 )
        //             })}
        //             </tbody>
        //         </Table>
        //     </div>
        // )
        console.log(this.state.controlHeight);
        return (
            <div className={"container"}>
                <Controls informHeight={this.updateHeight.bind(this)}/>
                <div className={"AutoSizerWrapper"} style={{height:`calc(100vh - ${this.state.controlHeight}px)`}}>
                    <InfiniteScroller data={text.split("\n")}/>
                </div>
            </div>
        )
    }
}

export default FileOutput;
