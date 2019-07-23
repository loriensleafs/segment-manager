import React, { useEffect, useLayoutEffect } from 'react';
import { Link } from '@reach/router';
import useApi from './../../hooks/useApi';
import storage from './../../storage';

const Header = props => {
	const [ user, fetchUser ] = useApi('/userDetails');

	useEffect(() => {
		fetchUser();
	}, []);

	useLayoutEffect(
		() => {
			if (!user.loading && !user.error) {
				storage.set('userDetails', user.data);
			} else if (user.error) {
				console.log('User details error', user.message);
			}
		},
		[ user ],
	);

	return (
		<nav className='site-nav'>
			<ul>
				<li className='logo-holder'>
					<Link to='/'>
						<div className='logo-wrapper'>
							<img src='logo' className='logo-img' alt='Logo' />
						</div>
						<p className='logo-text'>VULCAN</p>
					</Link>
				</li>
				<li className='user-holder'>
					<Link to='/'>
						<div className='name'>
							{user.data && user.data.firstName}
						</div>
					</Link>
				</li>
				<li className='link-disabled'>
					<div>
						<Link to='/'>
							<div>Dashboard</div>
						</Link>
					</div>
				</li>
				<li>
					<Link to='/segments'>
						<div>Audience</div>
					</Link>
				</li>
				<li className='link-disabled'>
					<div>
						<Link to='/data'>
							<div>Data</div>
						</Link>
					</div>
				</li>
				<li className='link-disabled'>
					<div>
						<Link to='/campaigns'>
							<div>Campaigns</div>
						</Link>
					</div>
				</li>
			</ul>
		</nav>
	);
};

export default Header;
