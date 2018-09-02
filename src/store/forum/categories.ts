import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMapTo } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';

import ApiSDK from '../../services/api';
import { init } from '../app/state';


// ACTIONS

const actionCreator = actionCreatorFactory('FORUM::CATEGORIES');
export const getCategories = actionCreator.async<undefined, string[], number>('GET_CATEGORIES');

// STATE

export interface IState {
	categories?: string[]
}

const INITIAL_STATE: IState = {};

// REDUCER

export default reducerWithInitialState(INITIAL_STATE)
	.case(getCategories.done, (state: IState, { result: categories }) => ({ ...state, categories}))
	.build();

// EPICS

const getCategoriesEpic: Epic = (action$) => action$.pipe(
	filter(init.match),
	mapTo(getCategories.started),
	mergeMapTo(from(ApiSDK.getCategories()).pipe(
		map((categories) => getCategories.done({ result: categories})),
		catchError((error) => of(getCategories.failed({ error: error.code }))),
	)),
);

export const epics = combineEpics(
	getCategoriesEpic
);
