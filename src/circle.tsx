/// <reference path="../typings/tsd.d.ts" />

import * as React from 'react';

export default class RedCircle extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state = { 
            cx: this.props.initCx,
            cy: this.props.initCy,
            r: this.props.initR,
        };
    }

	public render() {
		return (
            <circle cx={this.state.cx} cy={this.state.cy} r={this.state.r} stroke="black" stroke-width="3" fill="red" />
        );
	}
}
