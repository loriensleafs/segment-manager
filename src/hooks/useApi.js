import React, {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
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
const apiReducer = (state = [], action = {}) => {
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
				data: action.data || null,
			};
		case FAILURE:
			return {
				...state,
				status: 'error',
				message: action.message || null,
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
const useApi = (initialUrl = '', initOpts = {}) => {
	const [ options, setOptions ] = useState(null);
	const [ { data, status, message }, dispatchAPI ] = useReducer(apiReducer, {
		data: null,
		status: null,
		message: null,
	});

	const makeRequest = (url = initialUrl, opts = {}) =>
		setOptions({ ...initOpts, ...{ url, ...opts } });

	useEffect(
		() => {
			let didCancel = false;

			const fetchData = async () => {
				dispatchAPI({ type: REQUEST });

				try {
					const result = await axios(options);

					if (!didCancel) {
						dispatchAPI({ type: SUCCESS, data: result });
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

	return [
		{
			data,
			status,
			loading: status === 'loading',
			error: status === 'error',
			message,
		},
		makeRequest,
	];
};

export default useApi;
