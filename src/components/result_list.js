import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

const ResultList = ({result}) => {

	if(result && result.info) {
		return(
			<Jumbotron className="result-container">
				<p>Name : {result.info.name}</p>
				<p>Price : {result.info.price} {result.info.currency}</p>
			</Jumbotron>
		);
	}
	else {
		return(
			<div></div>
		);
	}
}

export default ResultList;
