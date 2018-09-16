import { combineEpics } from 'redux-observable';
import { filter, map, mapTo } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { Epic, Selector } from '../';
// import { of } from 'rxjs';


/* *************************** */
//       ACTIONS PREFIX        //
/* *************************** */

const actionCreator = actionCreatorFactory('APP::STATE');

/* *************************** */
//           ACTIONS           //
/* *************************** */

export const init = actionCreator('INIT');
export const setUsername = actionCreator<{username: string}>('SET_USERNAME');
export const verifyUsernameFromLocalStorage = actionCreator.async<undefined, {username: string}>('VERIFY_USERNAME_FROM_LOCALSTORAGE');

/* ********************************* */
//  STATE INTERFACE & INITIAL STATE  //
/* ********************************* */

export interface IState {
	initialized: boolean;
	user: {
		verifiedUsernameInLocalStorage: boolean;
		username?: string;
	}
}

const INITIAL_STATE: IState = {
	initialized: false,
	user: {
		verifiedUsernameInLocalStorage: false,
	},
};

/* *************************** */
//          SELECTORS          //
/* *************************** */

export const selectUsername: Selector<string | undefined> = ({ appState }) => appState.user.username;
export const selectVerifiedUsernameInLocalStorage: Selector<boolean> = ({ appState }) => appState.user.verifiedUsernameInLocalStorage;

/* *************************** */
//           REDUCER           //
/* *************************** */

export default reducerWithInitialState(INITIAL_STATE)
	.case(init, (state: IState) => ({
		...state,
		initialized: true,
	}))
	.case(setUsername, (state: IState, { username }) => {
		localStorage.setItem('username', username);
		return ({
			...state,
			user: {
				...state.user,
				username,
				isUsernameSet: true,
			},
		})
	})
	.case(verifyUsernameFromLocalStorage.done, (state: IState, { result: {username} }) => ({
		...state,
		user: {
			...state.user,
			username,
			isUsernameSet: true,
			verifiedUsernameInLocalStorage: true,
		},
	}))
	.case(verifyUsernameFromLocalStorage.failed, (state: IState) => ({
		...state,
		initialized: true,
		user: {
			...state.user,
			verifiedUsernameInLocalStorage: true,
		}
	}))
	.build();

/* *************************** */
//            EPICS            //
/* *************************** */

const triggetVerifyUsernameFromLocalStorageEpic: Epic = (action$) => action$.pipe(
	filter(init.match),
	mapTo(verifyUsernameFromLocalStorage.started()),
)

const verifyUsernameFromLocalStorageEpic: Epic = (action$) => action$.pipe(
	filter(verifyUsernameFromLocalStorage.started.match),
	map(() => {
		const username = localStorage.getItem('username');
		if(!username) {
			return verifyUsernameFromLocalStorage.failed({error: {}});
		}
		return verifyUsernameFromLocalStorage.done({result: {username}});
	})
)

export const epics = combineEpics(
	triggetVerifyUsernameFromLocalStorageEpic,
	verifyUsernameFromLocalStorageEpic
);
