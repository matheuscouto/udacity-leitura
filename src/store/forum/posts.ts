import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, mergeMapTo } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';

import { Comment as CommentType, Post as PostType } from '../../declarations';

import ApiSDK from '../../services/api';
import { init } from '../app/state';

const actionCreator = actionCreatorFactory('FORUM::POSTS');

// ACTIONS

export const getPosts = actionCreator.async<undefined, PostType[], any>('GET_POSTS');
export const getPostsByCategory = actionCreator.async<string, PostType[], any>('GET_POSTS_BY_CATEGORY');
export const submitPost = actionCreator.async<PostType, undefined, any>('SUBMIT_POST');
export const getPostDetails = actionCreator.async<string, PostType, any>('GET_POSTS_DETAILS');
export const votePost = actionCreator.async<{postId: string, option:'upVote' | 'downVote'}, undefined, any>('VOTE_POST');
export const editPost = actionCreator.async<{postId:string, title:string, body:string}, undefined, any>('EDIT_POST');
export const deletePost = actionCreator.async<string, undefined, any>('DELETE_POST');

export const getPostComments = actionCreator.async<string, CommentType[], any>('GET_POST_COMMENTS');
export const voteComment = actionCreator.async<{commentId: string, option:'upVote' | 'downVote'}, undefined, any>('VOTE_COMMENT');
export const submitComment = actionCreator.async<CommentType, undefined, any>('SUBMIT_COMMENT');
export const getCommentDetails = actionCreator.async<string, CommentType, any>('GET_COMMENT_DETAILS');
export const editComment = actionCreator.async<{commentId:string, timestamp: number, body:string}, undefined, any>('EDIT_COMMENT');
export const deleteComment = actionCreator.async<string, undefined, any>('DELETE_COMMENT');


// STATE

export interface IState {
	posts?: PostType[];
	postsByCategory?: {
		[categoryName: string]: PostType[],
	};
	onDisplay?: {
		post?: PostType,
		comments?: CommentType[]
	};
	commentDetail?: CommentType;
}

const INITIAL_STATE: IState = {};

// REDUCER

export default reducerWithInitialState(INITIAL_STATE)
	.case(getPosts.done, (state: IState, { result: posts }) => ({ ...state, posts}))
	.case(getPostsByCategory.done, (state: IState, { params: category, result: posts }) => ({
			...state,
			postsByCategory: {
				[category]: posts
			}
		}))
	.case(getPostDetails.done, (state: IState, { result: post }) => ({
		...state,
		onDisplay: {
			...state.onDisplay,
			post: { ...post },
		}
	}))
	.case(getPostComments.done, (state: IState, { result: comments }) => ({
		...state,
		onDisplay: {
			...state.onDisplay,
			comments: { ...comments },
		}
	}))
	.case(getCommentDetails.done, (state: IState, { result: comment }) => ({
		...state,
		commentDetail: { ...comment }
	}))
	.build();

// EPICS

const getPostsEpic: Epic = (action$) => action$.pipe(
	filter(submitPost.done.match),
	mapTo(getPosts.started()),
	mergeMapTo(from(ApiSDK.getPosts()).pipe(
		map((posts) => getPosts.done({ result: posts })),
		catchError((error) => of(getPosts.failed({ error: error.code }))),
	)),
);

const getPostsByCategoryEpic: Epic = (action$) => action$.pipe(
	filter(init.match || submitPost.done.match),
	mapTo(getPostsByCategory.started('react')),
	mergeMap(({payload: category}) => from(ApiSDK.getPostsByCategory(category)).pipe(
		map((posts) => getPostsByCategory.done({ params: category , result: posts})),
		catchError((error) => of(getPostsByCategory.failed({ params: category, error: error.code }))),
	)),
);

const submitPostEpic: Epic = (action$) => action$.pipe(
	filter(submitPost.started.match),
	mergeMap(({payload: post}) => from(ApiSDK.submitPost(post)).pipe(
		mapTo(submitPost.done({ params: post })),
		catchError((error) => of(submitPost.failed({ params: post, error: error.code }))),
	)),
);

const getPostDetailsEpic: Epic = (action$) => action$.pipe(
	filter(getPostDetails.started.match),
	mergeMap(({payload: postId}) => from(ApiSDK.getPostDetails(postId)).pipe(
		map((post) => getPostDetails.done({ params: postId , result: post})),
		catchError((error) => of(getPostDetails.failed({ params: postId, error: error.code }))),
	)),
);

const votePostEpic: Epic = (action$) => action$.pipe(
	filter(votePost.started.match),
	mergeMap(({payload: {postId, option}}) => from(ApiSDK.votePost(postId, option)).pipe(
		mapTo(votePost.done({ params: {postId, option}})),
		catchError((error) => of(votePost.failed({ params: {postId, option}, error: error.code }))),
	)),
);

const editPostEpic: Epic = (action$) => action$.pipe(
	filter(editPost.started.match),
	mergeMap(({payload: {postId, title, body}}) => from(ApiSDK.editPost(postId, title, body)).pipe(
		mapTo(editPost.done({ params: {postId, title, body}})),
		catchError((error) => of(editPost.failed({ params: {postId, title, body}, error: error.code }))),
	)),
);

const deletePostEpic: Epic = (action$) => action$.pipe(
	filter(deletePost.started.match),
	mergeMap(({payload: postId}) => from(ApiSDK.deletePost(postId)).pipe(
		mapTo(deletePost.done({ params: postId })),
		catchError((error) => of(deletePost.failed({ params: postId, error: error.code }))),
	)),
);

const getPostCommentsEpic: Epic = (action$) => action$.pipe(
	filter(getPostComments.started.match),
	mergeMap(({payload: postId}) => from(ApiSDK.getPostComments(postId)).pipe(
		map((comments) => getPostComments.done({ params: postId , result: comments})),
		catchError((error) => of(getPostComments.failed({ params: postId, error: error.code }))),
	)),
);

const voteCommentEpic: Epic = (action$) => action$.pipe(
	filter(voteComment.started.match),
	mapTo(voteComment.started({commentId: 'hfeuf9h19h9', option:'upVote'})),
	mergeMap(({payload: {commentId, option}}) => from(ApiSDK.voteComment(commentId, option)).pipe(
		mapTo(voteComment.done({ params: {commentId, option}})),
		catchError((error) => of(voteComment.failed({ params: {commentId, option}, error: error.code }))),
	)),
);

const submitCommentEpic: Epic = (action$) => action$.pipe(
	filter(submitComment.started.match),
	mergeMap(({payload: comment}) => from(ApiSDK.submitComment(comment)).pipe(
		mapTo(submitComment.done({ params: comment })),
		catchError((error) => of(submitComment.failed({ params: comment, error: error.code }))),
	)),
);

const getCommentDetailsEpic: Epic = (action$) => action$.pipe(
	filter(getCommentDetails.started.match),
	mergeMap(({payload: commentId}) => from(ApiSDK.getCommentDetails(commentId)).pipe(
		map((post) => getCommentDetails.done({ params: commentId , result: post})),
		catchError((error) => of(getCommentDetails.failed({ params: commentId, error: error.code }))),
	)),
);

const editCommentEpic: Epic = (action$) => action$.pipe(
	filter(editComment.started.match),
	mergeMap(({payload: {commentId, timestamp, body}}) => from(ApiSDK.editComment(commentId, timestamp, body)).pipe(
		mapTo(editComment.done({ params: {commentId, timestamp, body}})),
		catchError((error) => of(editComment.failed({ params: {commentId, timestamp, body}, error: error.code }))),
	)),
);

const deleteCommentEpic: Epic = (action$) => action$.pipe(
	filter(deleteComment.started.match),
	mergeMap(({payload: commentId}) => from(ApiSDK.deleteComment(commentId)).pipe(
		mapTo(deleteComment.done({ params: commentId })),
		catchError((error) => of(deleteComment.failed({ params: commentId, error: error.code }))),
	)),
);

export const epics = combineEpics(
	getPostsEpic,
	getPostsByCategoryEpic,
	submitPostEpic,
	getPostDetailsEpic,
	votePostEpic,
	editPostEpic,
	deletePostEpic,
	getPostCommentsEpic,
	voteCommentEpic,
	submitCommentEpic,
	getCommentDetailsEpic,
	editCommentEpic,
	deleteCommentEpic,
);
