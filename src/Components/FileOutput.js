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
        const object = this;
        fetch(fileUrl, {mode: mode})
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    if (fileType === "json") {
                        // Examine the text in the response as JSON
                        response.json().then(function (data) {
                            let conf = {};
                            conf[propertyName] = data;
                            object.setState(conf);
                        }).catch(() => {
                            console.log('The file is not proper JSON type.');
                        });
                    } else if (fileType === "text") {
                        // Examine the text in the response as text
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
        // reset Control config
        this.setState({fileConfig: undefined});
        this.requestFile({
            propertyName: 'fileConfig',
            fileUrl: this.props.location.pathname + "-read_config",
            fileType: "json"
        });
    }

    // called on updating properties
    componentWillReceiveProps(newProps) {
        this.requestFile({propertyName: 'file', fileUrl: newProps.location.pathname});
        // reset Control config
        this.setState({fileConfig: undefined});
        this.requestFile({
            propertyName: 'fileConfig',
            fileUrl: newProps.location.pathname + "-read_config",
            fileType: "json"
        });
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
        const problemsToShow = this.state.fileConfig ? this.state.fileConfig.list_to_show : undefined;
        const [lineStart, lineEnd] = this.getLinesNumbers();
        if (!text) {
            return <h3>Loading</h3>;
        }
        return (
            <div className={"container"}>
                <Controls
                    location={this.props.location}
                    informHeight={this.updateHeight.bind(this)}
                    fileConfig={problemsToShow}/>
                <div className={"AutoSizerWrapper"} style={{height: `calc(100vh - ${this.state.controlHeight}px)`}}>
                    <InfiniteScroller data={text.split("\n")} currentLineSt={lineStart} currentLineEnd={lineEnd}/>
                </div>
            </div>
        )
    }

}

export default FileOutput;
