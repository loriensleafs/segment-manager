import React, { createContext, useContext, useEffect, useReducer } from 'react';
import axios from 'axios';

/**
 * Action types for the apiReducer.
 */
const REQUEST = 'REQUEST';
const SUCCESS = 'REQUEST';
const FAILURE = 'FAILURE';

/**
 * The reducer that updates the state of the useApi hook.
 */
const apiReducer = (
	state = { data: null, status: null, message: null },
	action,
) => {
	switch (action.type) {
		case REQUEST:
			return {
				...state,
				status: 'loading',
			};
		case SUCCESS:
			return {
				...state,
				status: null,
				data: action.data,
			};
		case FAILURE:
			return {
				...state,
				status: 'error',
				message: action.message,
			};
		default:
			return state;
	}
};

/**
 * A hook to make api requests and easily manage the response state.
 * 
 * @param {String} initUrl - The endpoint of the api.
 * @param {Object} initOpts - Additional options for the request.
 * @return {Array} [{data, status, message}, makeRequest] - [{api state}, fetch]
 */
const useApi = (initUrl, initOpts = {}) => {
	const [ options, setOptions ] = useState({ url: initUrl, ...initOpts });
	const [ apiState, dispatchAPI ] = useReducer(apiReducer);

	const makeRequest = (url, opts = {}) =>
		setOptions({ ...options, ...{ url, ...opts } });

	useEffect(
		() => {
			let didCancel = false;

			const fetchData = async () => {
				dispatchAPI({ type: REQUEST });

				try {
					const result = await axios(options);

					if (!didCancel) {
						dispatchAPI({ type: SUCCESS, data: res.data });
					}
				} catch (error) {
					if (!didCancel) {
						dispatchAPI({ type: FAILURE, message: error });
					}
				}
			};

			fetchData();
			return () => {
				didCancel = true;
			};
		},
		[ options ],
	);

	return [ apiState, makeRequest ];
};

export default useApi;
