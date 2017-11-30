import React, {Component} from 'react';
import createHistory from 'history/createBrowserHistory';
import {Table} from "react-bootstrap";
import {HashLink as Link} from 'react-router-hash-link';
import uuid from 'uuid';

// This class gets data
class Layout extends Component {

    constructor(props) {
        super(props);
    }

    // componentWillMount() {
    //
    // }
    //
    // componentWillReceiveProps(newProps) {
    //
    // }

    goToLine() {
        let number = this.getLinesNumbers()[0]; // get first line
        let elem = document.getElementById(number); //element to which to scroll.
        if (elem) {
            elem.scrollIntoView()
            // window.scrollBy(0, -100)
        }
    }

    getLinesNumbers() {
        let [lineStart, lineEnd] = this.props.location.hash.substring(1).split("-");
        lineStart = lineStart ? Number(lineStart) : undefined;
        lineEnd = lineEnd ? Number(lineEnd) : undefined;
        return [lineStart, lineEnd]
    }

    componentDidMount() {
        // Scroll to element view
        this.goToLine();
    };

    componentDidUpdate() {
        // Scroll to element view
        this.goToLine();
    }

    render() {
        // console.log(this);
        // TODO cia rerenderint history
        let text = this.props.file;
        let history = createHistory();
        let location = history.location;
        // console.log(this.props.location);
        // console.log(window.location.href);
        const [lineStart, lineEnd] = this.getLinesNumbers();
        if (!text) {
            return <div></div>;
        }
        return (
            <div>
                <Table bordered={false} condensed={true} hover>
                    <tbody>
                    {text.split("\n").map((line, pos) => {
                        let rowClass = "textRow";
                        if (lineEnd) {
                            if (pos >= lineStart && pos <= lineEnd) {
                                rowClass += " success";
                            }
                        } else {

                            if (pos === lineStart) {
                                console.log(lineStart)
                                rowClass += " success";
                            }
                        }
                        return (
                            <tr key={uuid.v4()} className={rowClass}>
                                <td className={"numberColumn"}>
                                    <Link to={"#" + pos}>{pos}</Link>
                                </td>
                                <td className={"textColumn"} id={pos}>{line}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Layout;
