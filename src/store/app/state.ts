import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import {
	SDKAuthStateObservable,
	SDKCreateUserWithEmailAndPassword,
	SDKSignInWithEmailAndPassword,
	SDKSignOut,
} from '../../services/firebase';

import { Epic, Selector } from '../';

export type AuthStateStatus = 'pristine' | 'unauthenticated' | 'authenticated';

export interface IPayloadFetchAuthState {
	authState: AuthStateStatus,
	uid?: string,
};

// ACTIONS

const actionCreator = actionCreatorFactory('APP::STATE');
export const init = actionCreator('INIT');
export const fetchAuthState = actionCreator<IPayloadFetchAuthState>('REQUEST_USER_AUTH_STATE');
export const signInWithEmailAndPassword = actionCreator.async<{email: string, password: string}, any, string>('SIGN_IN_WITH_EMAIL_AND_PASSWORD');
export const createUserWithEmailAndPassword = actionCreator.async<{email: string, password: string}, any, string>('CREATE_USER_WITH_EMAIL_AND_PASSWORD');
export const signOut = actionCreator.async<undefined, any>('SIGN_OUT');
export const openSignUserModal = actionCreator('OPEN_SIGN_USER_MODAL');
export const closeSignUserModal = actionCreator('CLOSE_SIGN_USER_MODAL');

export const selectIsRequestingPostList: Selector<boolean> = ({ appState  }) => appState.signUserModalIsOpen;

// STATE

export interface IState {
	initialized: boolean;
	authState: AuthStateStatus;
	signUserModalIsOpen: boolean;
}

const INITIAL_STATE: IState = {
	initialized: false,
	authState: 'pristine',
	signUserModalIsOpen: false,
};

// REDUCER

export default reducerWithInitialState(INITIAL_STATE)
	.case(init, (state: IState) => ({
		...state,
		initialized: true }))
	.case(fetchAuthState, (state: IState, authState) => ({
		...state,
		...authState }))
	.case(signInWithEmailAndPassword.started, (state: IState,) => ({
		...state,
		isSigningIn: true }))
	.cases([signInWithEmailAndPassword.done, signInWithEmailAndPassword.failed], (state: IState,) => ({
		...state,
		isSigningIn: false }))
	.case(createUserWithEmailAndPassword.started, (state: IState,) => ({
		...state,
		isSigninUp: true }))
	.cases([createUserWithEmailAndPassword.done, createUserWithEmailAndPassword.failed], (state: IState,) => ({
		...state,
		isSigninUp: false }))
	.case(signOut.started, (state: IState,) => ({
		...state,
		isSigningOut: true }))
	.cases([signOut.done, signOut.failed], (state: IState,) => ({
		...state,
		isSigningOut: false }))
	.case(openSignUserModal, (state: IState) => ({
		...state,
		signUserModalIsOpen: true,
	}))
	.case(openSignUserModal, (state: IState) => ({
		...state,
		signUserModalIsOpen: false,
	}))
	.build();

// EPICS

const authStateObservableEpic: Epic = (action$) => action$.pipe(
	filter(init.match),
	mergeMap(() => SDKAuthStateObservable.pipe(
		map((user) => {
			if(!user) {
				return fetchAuthState({ authState: 'unauthenticated' })
			}
			return fetchAuthState({ authState: 'authenticated', uid: user.uid })
		}),
	)),
);

const createUserWithEmailAndPasswordEpic: Epic = (action$) => action$.pipe(
	filter(createUserWithEmailAndPassword.started.match),
	mergeMap(({ payload: { email, password } }) => from(SDKCreateUserWithEmailAndPassword(email, password)).pipe(
		mapTo(createUserWithEmailAndPassword.done({ params: { email, password } })),
		catchError((error) => of(createUserWithEmailAndPassword.failed({ params: { email, password }, error: error.code }))),
	)),
);

const signInWithEmailAndPasswordEpic: Epic = (action$) => action$.pipe(
	filter(signInWithEmailAndPassword.started.match),
	mergeMap(({ payload: { email, password } }) => from(SDKSignInWithEmailAndPassword(email, password)).pipe(
		mapTo(signInWithEmailAndPassword.done({ params: { email, password } })),
		catchError((error) => of(signInWithEmailAndPassword.failed({ params: { email, password }, error: error.code }))),
	)),
);

const signOutEpic: Epic = (action$) => action$.pipe(
	filter(signOut.started.match),
	mergeMap(() => from(SDKSignOut()).pipe(
		mapTo(signOut.done({})),
		catchError((error) => of(signOut.failed({ error }))),
	)),
);

export const epics = combineEpics(
	authStateObservableEpic,
	createUserWithEmailAndPasswordEpic,
	signInWithEmailAndPasswordEpic,
	signOutEpic,
);
