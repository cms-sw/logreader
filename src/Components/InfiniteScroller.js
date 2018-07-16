import React, {Component} from "react";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from "react-virtualized";
import Highlight from "react-highlighter";
import {Link} from "react-router-dom";

const cellMeasurerCacheConfig = {
    fixedWidth: true,
    // hard codded to match file line size
    defaultHeight: 17
};

class InfiniteScroller extends Component {
    constructor(props) {
        super(props);
        this.cache = new CellMeasurerCache(cellMeasurerCacheConfig);
        this.state = {
            currentLineSt: props.currentLineSt,
            currentLineEnd: props.currentLineEnd,
            data: props.data,
            location: props.location,
            pathName: props.pathName
        }
    }

    renderRow = ({index, parent, key, style}) => {
        let className = "code-line";
        const line_nr = index + 1;
        const searchPhrase = this.state.searchPhrase;
        // TODO if -else logic could be better
        if ((this.state.currentLineSt || this.state.currentLineSt === 0 ) && this.state.currentLineEnd) {
            if (this.state.currentLineSt <= line_nr && this.state.currentLineEnd >= line_nr) {
                className += " code-line-focus";
            }
        } else if (this.state.currentLineSt || this.state.currentLineSt === 0) {
            if (this.state.currentLineSt === line_nr) {
                className += " code-line-focus";
            }
        }

        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                <div style={style} className={className}>
                    <span className={"code-index unselectable"}>
                            <Link to={"/" + line_nr} unselectable={"on"} onSelect="return false">{line_nr}: </Link>
                    </span>
                    <span className={"code"} style={{whiteSpace: "pre-wrap"}}>
                        <Highlight matchClass="search-match-class"
                                   search={searchPhrase ? searchPhrase : ""}>{this.state.data[index]}<br/></Highlight>
                    </span>
                </div>
            </CellMeasurer>
        )
    };

    updatePosition() {
        const index = this.state.currentLineSt - 1;
        if (index) {
            this.myInfiniteList.scrollToRow(index);
        }
    }

    updateGrid() {
        this.cache.clearAll();
    }

    componentDidUpdate() {
        this.updatePosition();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateGrid.bind(this));
        this.updatePosition();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateGrid.bind(this));
    }

    componentWillReceiveProps(newProps) {
        const {currentLineSt, currentLineEnd, data, location, searchPhrase} = newProps;
        this.setState({
            currentLineSt,
            currentLineEnd,
            data,
            location,
            searchPhrase
        });
    }

    render() {
        return (
            <AutoSizer>
                {
                    ({width, height}) => {
                        return (
                            <List
                                searchPhrase={this.state.searchPhrase}
                                currentLineSt={this.state.currentLineSt}
                                currentLineEnd={this.state.currentLineEnd}
                                ref={(ref) => this.myInfiniteList = ref}
                                rowCount={this.props.data.length}
                                width={width}
                                height={height}
                                deferredMeasurementCache={this.cache}
                                rowHeight={this.cache.rowHeight}
                                rowRenderer={this.renderRow}
                                scrollToAlignment="center"
                            />
                        )
                    }
                }
            </AutoSizer>
        );
    }
}

export default InfiniteScroller;
