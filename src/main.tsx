/// <reference path="../typings/tsd.d.ts" />

import * as React from 'react';
import * as DOM from 'react-dom';
import HelloWorld from './helloworld';
import RedCircle from './circle';

const root = document.getElementById('app');

class Main extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

	public render() {
		return (
            <div>
              <HelloWorld defaultName='World' />
              <HelloWorld defaultName='my little' />
              <HelloWorld defaultName='my Lord' />
              <svg height="100" width="100">
                  <RedCircle initCx="30" initCy="30" initR="13"/>
              </svg>
            </div>
        );
	}
}

DOM.render(<Main />, root);  