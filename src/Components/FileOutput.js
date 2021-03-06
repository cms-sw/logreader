import React, { Component } from 'react';
import InfiniteScroller from "./InfiniteScroller";
import Controls from "./Controls";

// This class gets data
class FileOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controlHeight: 100,
            indexList: props.indexList ? props.indexList : [],
            pathName: window.location.pathname
        }
    }

    goToLine() {
        let number = this.getLinesNumbers()[0]; // get first line
        let elem = document.getElementById(number); //element to which to scroll.
        if (elem) {
            elem.scrollIntoView()
        }
    }

    requestFile({ propertyName, fileUrl, mode = 'cors', fileType = 'text' }) {
        const object = this;
        fetch(fileUrl, { mode: mode })
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
                    }).catch((err) => {
                        console.log('The file is not proper JSON type: ' + err);
                    });
                } else if (fileType === "text") {
                    // Examine the text in the response as text
                    response.text().then(function (data) {
                        let conf = {};
                        conf[propertyName] = data.split("\n");
                        object.setState(conf);
                    });
                }
            }
            )
            .catch(function (err) {
                let conf = {};
                conf[propertyName] = null;
                object.setState(conf);
                console.log('Fetch Error :-S', err);
            });
    }

    getLinesNumbers() {
        let [lineStart, lineEnd] = this.props.location.pathname.substring(1).split("-");
        lineStart = lineStart ? Number(lineStart) : undefined;
        lineEnd = lineEnd ? Number(lineEnd) : undefined;
        return [lineStart, lineEnd]
    }

    getFiles() {
        // manually create links to file
        const { pathName } = this.state;
        let urlRaw = pathName.replace("/SDT/cgi-bin/logreader/", "/SDT/cgi-bin/buildlogs/raw/");
        let urlRawConfig = pathName.replace("/SDT/cgi-bin/logreader/", "/SDT/cgi-bin/buildlogs/raw_read_config/");

        // will set links to state so it could be passed to child components
        this.setState({ urlRaw });

        this.requestFile({ propertyName: 'file', fileUrl: urlRaw });
        // reset Control config
        this.setState({ fileConfig: undefined });
        this.requestFile({
            propertyName: 'fileConfig', fileUrl: urlRawConfig, fileType: "json"
        });

        // TODO This will add hostname to logReader. Maybe should be added to config object from backend?
        let fileHostnameUrl = urlRaw.replace(/\/[^/]*$/,"/hostname");
        this.requestFile({
            propertyName: 'file_hostname', fileUrl: fileHostnameUrl
        });

        // // for local development
        // this.requestFile({
        //     propertyName: 'file_hostname', fileUrl: "http://localhost:3000/file_hostname"
        // });
        // this.requestFile({
        //     propertyName: 'fileConfig', fileUrl: 'http://localhost:8000/config.json', fileType: "json"
        // });
    }


    // called before first render
    componentWillMount() {
        this.getFiles();
    }

    // called on updating properties
    componentWillReceiveProps() {
        if (window.location.pathname !== this.state.pathName) {
            // Scroll to element view
            this.setState({ pathName: window.location.pathname });
            this.getFiles();
        }
    }

    // called after first render
    componentDidMount() {
        // Scroll to element view
        this.goToLine();
    }

    // called after sequential render
    componentDidUpdate() {
        this.goToLine();
    }

    updateHeight(controlHeight) {
        this.setState({ controlHeight });
    }

    updateSearchPhrase(searchPhrase) {
        this.setState({ searchPhrase });
    }

    render() {
        let file = this.state.file;
        let file_hostname = this.state.file_hostname;

        // if (file_hostname){
        //     // TODO This will add hostname to logReader. Maybe should be added to config object from backend?
        //     file_hostname = file_hostname.concat(["-----" , "" ]);
        //     file = file_hostname.concat( file );
        // }
        const dropdownToShowList = this.state.fileConfig ? this.state.fileConfig.show_controls : undefined;
        const [lineStart, lineEnd] = this.getLinesNumbers();
        if (file === null) {
            return <h3>File does not exist</h3>;
        } else if (!file) {
            return <h3>Loading</h3>;
        }
        return (
            <div className={"container"}>
                <Controls
                    data={file}
                    history={this.props.history}
                    location={this.props.location}
                    pathName={this.state.pathName}
                    urlRaw={this.state.urlRaw}
                    informHeight={this.updateHeight.bind(this)}
                    updateSearchPhrase={this.updateSearchPhrase.bind(this)}
                    fileConfig={dropdownToShowList}
                    file_hostname={file_hostname}
                />
                <div className={"AutoSizerWrapper"} style={{ height: `calc(100vh - ${this.state.controlHeight}px)` }}>
                    <InfiniteScroller
                        history={this.props.history}
                        data={file}
                        currentLineSt={lineStart}
                        currentLineEnd={lineEnd}
                        searchPhrase={this.state.searchPhrase}
                        location={this.props.location}
                        pathName={this.state.pathName}
                    />
                </div>
            </div>
        )
    }

}

export default FileOutput;
