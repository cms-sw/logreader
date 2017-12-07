import React, {Component} from "react";
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from "react-virtualized";

class InfiniteScroller extends Component {
    constructor(props) {
        super(props);
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
        });

    }

    renderRow = ({index, parent, key, style}) => {
        return (
            <CellMeasurer
                key={key}
                cache={this.cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                <div style={style} className={"code-line"}>

                    <span className={"code-index"}><b>{index}: </b></span>
                    <span className={"code"} style={{whiteSpace: "pre-wrap"}}>{this.props.data[index]}</span>
                </div>
            </CellMeasurer>
        )
    };

    render() {
        return (

            <AutoSizer>
                {
                    ({width, height}) => {
                        return <List
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
