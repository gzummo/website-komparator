import React, { Component } from 'react';


class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {term: ""};
	}
	
	onInputChange = (event) => {
		this.props.onUpdateTerm(event.target.value)
		this.setState({term: event.target.value});
	}

	render() {
		return (
			<div className="search-bar">
				<input type="text"
					value={this.state.term}
					onKeyPress={this.props.onSearch}
					onChange={this.onInputChange} />
			</div>
		);
	}
}


export default SearchBar;
