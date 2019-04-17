import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import SweetAlert from 'react-bootstrap-sweetalert'
import SearchBar from './components/search_bar';
import ResultList from './components/result_list';
import io from 'socket.io-client';
import './styles/App.css';


class App extends Component {
	constructor(props){
		super(props);

		this.state = {
			term: "",
			result: null,
			alert: null,
			progress: 0,
			sid: null
		};
		
	}

	componentDidMount() {
		this.socket = io('http://localhost:5000');
		this.socket.on('connect', () => {this.setState({sid: this.socket.id});});
		this.socket.on("update", (data) => {this.setState({progress: data.data});});
	}

	componentWillUnmount() {
		this.socket.close();
	}
	

	onUpdateTerm = (term) => {
		this.setState({term: term})
	}
	
	getSearchResult = async () => {
		
		return await axios.post("http://127.0.0.1:5000/api/find-cheaper", {url: this.state.term, sid: this.state.sid})
				
	}

	onSearch = (event) => {
		if(event.key === "Enter" && this.state.term !== "") {
			this.setState({progress: 1})
			this.getSearchResult().then((response) => {
				this.setState({result: response.data}, () => {this.getAlert()})
			});
		}
	}

	getAlert = () => {
		if(this.state.result){
			if(this.state.result.url){
				this.setState({alert: this.resultAlert()})
			}
			else if(this.state.result.error){
				this.setState({alert: this.errorAlert()})
			}
			
		}
	}

	resultAlert = () => (
			<SweetAlert 
				success
				showCancel
				confirmBtnText="Go to product page"
				confirmBtnBsStyle="success"
				cancelBtnBsStyle="default"
				title="We found something !"
				onConfirm={() => this.openInNewTab(this.state.result.url)}
				onCancel={() => this.hideAlert()}
			>
				{this.state.result.url}
			</SweetAlert>
	)

	errorAlert = () => (
			<SweetAlert 
				danger
				showCancel
				confirmBtnText="Understood"
				confirmBtnBsStyle="primary"
				cancelBtnBsStyle="default"
				title="No Luck"
				onConfirm={() => this.hideAlert()}
				onCancel={() => this.hideAlert()}
			>
				{this.state.result.error}
			</SweetAlert>
	)

	hideAlert = () => {
		this.setState({alert: null, progress: 0})
	}

	openInNewTab(url) {
		window.open(url, '_blank');
		this.hideAlert()
	}

	render() {
		return (
			<div className="container h-100 text-center">
			    <div className="row align-items-center h-100">
					<div className="col-6 mx-auto">
					    <SearchBar
						className="search-bar"
						term={this.state.term} 
						onSearch={this.onSearch}
						onUpdateTerm={this.onUpdateTerm}/>
						<ProgressBar animated now={this.state.progress} />
					</div>
			    </div>
			    <div className="row align-items-center">
					<div className="col-6 mx-auto">
					    <ResultList
					    result={this.state.result} />
					</div>
			    </div>
			    <div> 
					{this.state.alert}
			    </div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
