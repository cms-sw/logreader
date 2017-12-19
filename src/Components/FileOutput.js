import React, {Component} from 'react';
import InfiniteScroller from "./InfiniteScroller";
import Controls from "./Controls";

// This class gets data
class FileOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controlHeight: 100,
            indexList: props.indexList ? props.indexList : []
        }
    }

    goToLine() {
        let number = this.getLinesNumbers()[0]; // get first line
        let elem = document.getElementById(number); //element to which to scroll.
        if (elem) {
            elem.scrollIntoView()
        }
    }

    requestFile({propertyName, fileUrl, mode = 'cors', fileType = 'text'}) {
        fileUrl = fileUrl.substring(1);
        console.log(fileUrl);
        const object = this;
        fetch(fileUrl, {mode: mode})
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    if (fileType = "json") {
                        // Examine the text in the response
                        response.json().then(function (data) {
                            let conf = {};
                            conf[propertyName] = data;
                            object.setState(conf);
                        });
                    } else if (fileType = "text") {
                        // Examine the text in the response
                        response.text().then(function (data) {
                            let conf = {};
                            conf[propertyName] = data;
                            object.setState(conf);
                        });
                    }

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
        this.requestFile({propertyName: 'file', fileUrl: this.props.location.pathname});
        this.requestFile({propertyName: 'fileConfig', fileUrl: this.props.location.pathname + "_json", fileType: "json"});
    }

    // called on updating properties
    componentWillReceiveProps(newProps) {
        this.requestFile({propertyName: 'file', fileUrl: newProps.location.pathname});
        this.requestFile({propertyName: 'fileConfig', fileUrl: newProps.location.pathname + "_json", fileType: "json"});
    }

    // called after first render
    componentDidMount() {
        // Scroll to element view
        this.goToLine();
    }

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
        console.log(this.state.fileConfig);
        return (
            <div className={"container"}>
                <Controls
                    informHeight={this.updateHeight.bind(this)}
                    fileConfig={this.state.fileConfig}/>
                <div className={"AutoSizerWrapper"} style={{height: `calc(100vh - ${this.state.controlHeight}px)`}}>
                    <InfiniteScroller data={text.split("\n")} currentLineSt={lineStart} currentLineEnd={lineEnd}/>
                </div>
            </div>
        )
    }
}

export default FileOutput;
