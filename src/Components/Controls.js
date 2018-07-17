import React, { Component } from "react";
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
        //// To make search ready on load  
        // this.indexData(props.data); 
    }

    indexData(data) {
        let searchApi = this.searchApi;
        for (let i = 0; i < data.length; i++) {
            searchApi.indexDocument(i, data[i]);
        }
        // TODO HACK to set search ready
        this.searchApi.search("").then(function () {
            this.setState({ searchReady: true })
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
            this.setState({ height });
            this.props.informHeight(height + 20);
        }
    }

    // called after first render
    componentDidMount() {
        this.getHeight();
        window.addEventListener('resize', this.getHeight.bind(this))
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.getHeight.bind(this))
    }

    // called after sequential render
    componentDidUpdate() {
        this.getHeight();
    };

    // called on updating properties
    componentWillReceiveProps(newProps) {
        if (newProps.fileConfig) {
            let fileConfig = newProps.fileConfig;
            this.setState({ fileConfig });
        } else {
            let fileConfig = [];
            this.setState({ fileConfig });
        }
    }

    changeSearchPosition(position) {
        let { searchPosition, searchResultIndexes } = this.state;
        let newSearchPosition = searchPosition + position;
        if (0 <= newSearchPosition && newSearchPosition < searchResultIndexes.length) {
            searchPosition = newSearchPosition;
        } else if (position < 0) {
            searchPosition = searchResultIndexes.length - 1;
        } else if (position > 0) {
            searchPosition = 0;
        }
        this.setState({ searchPosition: searchPosition });
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
        const { searchResultIndexes } = this.state;
        const line = searchResultIndexes[searchPosition] + 1;
        this.props.history.replace("/" + line);
    }

    onUpdateProp(e) {
        this.searchData(e.target.value);
    }

    enableSearch() {
        this.setState({ seachEnabled: true })
        this.indexData(this.props.data);
    }

    render() {
        let searchResults = null;
        const disableSearch = this.state.searchResultIndexes.length <= 0;
        if (this.state.searchResultIndexes) {
            searchResults = (this.state.searchResultIndexes.length > 0) ? (this.state.searchPosition + 1) +
                "/" + this.state.searchResultIndexes.length : "";
        }
        let searchFieldPlaceholder = !this.state.searchReady ? "Indexing data" : "Search";
        let searchField = (
            <FormControl disabled={!this.state.searchReady} onChange={this.onUpdateProp.bind(this)} bsSize="small"
                type="text"
                placeholder={searchFieldPlaceholder} />
        );

        let searchControls;
        if (this.state.seachEnabled) {
            searchControls = (
                <Navbar.Form>
                    <FormGroup>
                        <InputGroup>
                            {searchField}
                            <InputGroup.Button>
                                <Button disabled={disableSearch} bsSize="small"
                                    onClick={this.searchPreviousClick.bind(this)}>
                                    <Glyphicon glyph="menu-left" />
                                </Button>
                            </InputGroup.Button>
                            <InputGroup.Addon>
                                {searchResults}
                            </InputGroup.Addon>
                            <InputGroup.Button>
                                <Button disabled={disableSearch} bsSize="small"
                                    onClick={this.searchNextClick.bind(this)}>
                                    <Glyphicon glyph="menu-right" />
                                </Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                </Navbar.Form>
            );
        } else {
            searchControls = (
                <Nav>
                    <NavItem onClick={this.enableSearch.bind(this)} >
                        Enable search
                    </NavItem>
                </Nav>
            );
        }

        return (
            <div id={"control"} style={{ paddingTop: 10 }}>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <p>Go to</p>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            {
                                this.state.fileConfig.map(dropdown => {
                                    return <NavDropdown title={dropdown.name} id="basic-nav-dropdown">
                                        {dropdown.list.map(item => {
                                            return (
                                                // prop onClick with magic , history replace
                                                <MenuItem key={uuid.v4()}
                                                    href={this.props.pathName + "#" + (item.lineStart) + "-" + (item.lineEnd)}>{item.name}</MenuItem>
                                            )
                                        }
                                        )}
                                    </NavDropdown>
                                })
                            }
                            <NavItem href={this.props.urlRaw}>
                                Get raw file
                        </NavItem>
                        </Nav>
                        {searchControls}
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }

}

export default Controls;
