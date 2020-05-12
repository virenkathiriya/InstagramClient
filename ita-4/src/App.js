import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Header from "./containers/Header/Header";

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Header />
			</BrowserRouter>
		);
	}
}

export default App;
