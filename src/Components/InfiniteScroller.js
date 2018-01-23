import React, {Component} from "react";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from "react-virtualized";
import Highlight from "react-highlighter";

const cellMeasurerCacheConfig = {
    fixedWidth: true,
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
        const searchPhrase = this.state.searchPhrase;
        // TODO if -else logic could be better
        if ((this.state.currentLineSt || this.state.currentLineSt === 0 ) && this.state.currentLineEnd) {
            if (this.state.currentLineSt <= index && this.state.currentLineEnd >= index) {
                className += " code-line-focus";
            }
        } else if (this.state.currentLineSt || this.state.currentLineSt === 0) {
            if (this.state.currentLineSt === index) {
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
                    <span className={"code-index"}>
                            <a href={this.state.pathName + "#/" + index}>{index}: </a>
                    </span>
                    <span className={"code"} style={{whiteSpace: "pre-wrap"}}>
                        <Highlight matchClass="search-match-class"
                                   search={searchPhrase ? searchPhrase : ""}>{this.state.data[index]}</Highlight>
                    </span>
                </div>
            </CellMeasurer>
        )
    };

    updatePosition() {
        const goToLine = this.state.currentLineSt;
        if (goToLine) {
            console.log("scrolled to : " + goToLine);
            this.myInfiniteList.scrollToRow(goToLine);
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
        // this.cache = new CellMeasurerCache(cellMeasurerCacheConfig);
    }

    render() {
        return (
            <AutoSizer>
                {
                    ({width, height}) => {
                        return <List
                            ref={(ref) => this.myInfiniteList = ref}
                            rowCount={this.props.data.length}
                            width={width}
                            height={height}
                            deferredMeasurementCache={this.cache}
                            rowHeight={this.cache.rowHeight}
                            rowRenderer={this.renderRow}
                        />
                    }
                }
            </AutoSizer>
        );
    }
}

export default InfiniteScroller;
