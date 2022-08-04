import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Tree from './components/Tree';
import data from './data';

ReactDOM.render(<Tree data={data}/>, document.getElementById('root'));
