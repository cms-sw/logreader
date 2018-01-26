import React, {Component} from "react";
import uuid from 'uuid'
import {
    Button,
    FormControl,
    FormGroup,
    Glyphicon,
    InputGroup,
    MenuItem,
    Nav,
    Navbar,
    NavDropdown,
    NavItem
} from "react-bootstrap";
import SearchApi from 'js-worker-search'

class Controls extends Component {
    constructor(props) {
        super(props);
        this.searchApi = new SearchApi();
        this.updateSearchPrase = props.updateSearchPhrase;
        this.state = {
            height: 100,
            fileConfig: props.fileConfig ? props.fileConfig : [],
            searchPosition: 0,
            searchResultIndexes: [],
            searchReady: false
        };
        this.indexData(props.data);
    }

    indexData(data) {
        let searchApi = this.searchApi;
        for (let i = 0; i < data.length; i++) {
            searchApi.indexDocument(i, data[i]);
        }
        // TODO HACK to set search ready
        this.searchApi.search("").then(function () {
            this.setState({searchReady : true})
        }.bind(this));
    }

    searchData(phrase) {
        if (phrase === "") {
            // if not search phrase, return
            this.setState({
                searchPosition: 0,
                searchResultIndexes: [],
            });
            this.updateSearchPrase(phrase);
            this.props.history.replace("/");
            return;
        }
        this.searchApi.search(phrase).then(function (response) {
            this.setState({
                searchPosition: 0,
                searchResultIndexes: response
            });
            this.updateSearchPrase(phrase);
            this.goToSearchedLine(0);
        }.bind(this), function (response) {
            console.log("Search error: ", response);
        })
    }

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

    changeSearchPosition(position) {
        let {searchPosition, searchResultIndexes} = this.state;
        let newSearchPosition = searchPosition + position;
        if (0 <= newSearchPosition && newSearchPosition < searchResultIndexes.length) {
            searchPosition = newSearchPosition;
        } else if (position < 0) {
            searchPosition = searchResultIndexes.length - 1;
        } else if (position > 0) {
            searchPosition = 0;
        }
        this.setState({searchPosition: searchPosition});
        this.goToSearchedLine(searchPosition)
    }

    searchNextClick() {
        this.changeSearchPosition(1);
    }

    searchPreviousClick() {
        this.changeSearchPosition(-1);
    }

    goToSearchedLine(searchPosition) {
        // index starts from 0, line from 1
        console.log(this.props.history);
        const {searchResultIndexes} = this.state;
        const line = searchResultIndexes[searchPosition] + 1;
        this.props.history.replace("/" + line);
    }

    onUpdateProp(e) {
        this.searchData(e.target.value);
    }

    render() {
        let searchResults = null;
        const disableSearch = this.state.searchResultIndexes.length <= 0;
        if (this.state.searchResultIndexes) {
            searchResults = (this.state.searchResultIndexes.length > 0 ) ? (this.state.searchPosition + 1 ) +
                "/" + this.state.searchResultIndexes.length : "";
        }
        let searchFieldPlaceholder = !this.state.searchReady ? "Indexing data" : "Search";
        let searchField = (
            <FormControl disabled={!this.state.searchReady} onChange={this.onUpdateProp.bind(this)} bsSize="small" type="text"
                         placeholder={searchFieldPlaceholder}/>
        );
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
                                        // prop onClick with magic , history replace
                                        <MenuItem key={uuid.v4()}
                                                  href={this.props.pathName + "#" + (item.lineStart) + "-" + (item.lineEnd)}>{item.name}</MenuItem>
                                    )
                                }
                            )}
                        </NavDropdown>
                        <NavItem href={this.props.urlRaw}>
                            Get raw file
                        </NavItem>
                    </Nav>
                    {/*<Navbar.Form pullRight>*/}
                    <Navbar.Form>
                        <FormGroup>
                            <InputGroup>
                                {searchField}
                                <InputGroup.Button>
                                    {/*<Button bsSize="small" onClick={this.searchNextClick.bind(this)}>*/}
                                    {/*<Glyphicon glyph="search"/>*/}
                                    {/*</Button>*/}
                                    <Button disabled={disableSearch} bsSize="small"
                                            onClick={this.searchPreviousClick.bind(this)}>
                                        <Glyphicon glyph="menu-left"/>
                                    </Button>
                                </InputGroup.Button>
                                <InputGroup.Addon>
                                    {searchResults}
                                </InputGroup.Addon>
                                <InputGroup.Button>
                                    <Button disabled={disableSearch} bsSize="small"
                                            onClick={this.searchNextClick.bind(this)}>
                                        <Glyphicon glyph="menu-right"/>
                                    </Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Navbar.Form>
                </Navbar>
            </div>
        );
    }

}

export default Controls;
