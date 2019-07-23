import React, { Fragment, Suspense, lazy } from 'react';
import { Router, Link } from '@reach/router';
import Header from './../Header';

const Home = () => <div>HOME PAGE</div>;

const AnotherPage = () => <div>PAGE 2</div>;

export default props => (
	<Fragment>
		<Header />
		<Router>
			<Home path='/' />
			<AnotherPage path='/page2' />
		</Router>
	</Fragment>
);
