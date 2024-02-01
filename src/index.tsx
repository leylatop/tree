import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { writeLog } from './api';
import Tree from './components/Tree';
import data from './data';

window.onload = () => {
  writeLog('onload', new Date().getTime())

}
window.onbeforeunload = () => {
  // console.time('unload-test')
  // return false
  writeLog('onbeforeunload', new Date().getTime())
}

window.onunload = () => {
  // console.timeEnd('unload-test')
  writeLog('onunload', new Date().getTime())
}

ReactDOM.render(<Tree data={data}/>, document.getElementById('root'));
