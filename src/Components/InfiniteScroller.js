import React, {Component} from "react";
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from "react-virtualized";

class InfiniteScroller extends Component {
    constructor(props) {
        super(props);
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
        });
        this.state = {
            currentLineSt: props.currentLineSt,
            currentLineEnd: props.currentLineEnd,
            data: props.data
        }
    }

    renderRow = ({index, parent, key, style}) => {
        let className = "code-line";

        if ((this.state.currentLineSt || this.state.currentLineSt === 0 ) && this.state.currentLineEnd) {
            if (this.state.currentLineSt <= index && this.state.currentLineEnd >= index) {
                className += " code-line-focus";
            }
        } else if (this.state.currentLineSt) {
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
                    <span className={"code-index"}><b>{index}: </b></span>
                    <span className={"code"} style={{whiteSpace: "pre-wrap"}}>{this.state.data[index]}</span>
                </div>
            </CellMeasurer>
        )
    };

    updatePosition() {
        const goToLine = this.state.currentLineSt;
        if (goToLine) {
            this.myInfiniteList.scrollToRow(goToLine);
        }
    }

    updateGrid(){
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
        const {currentLineSt, currentLineEnd, data} = newProps;
        this.setState({
            currentLineSt,
            currentLineEnd,
            data
        });
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 500
        });
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
