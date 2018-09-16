import * as _ from 'lodash';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, mergeMapTo } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';

import { Comment as CommentType, Post as PostType } from '../../declarations';

import { Epic, Selector } from '../';
import ApiSDK from '../../services/api';


/* *************************** */
//       ACTIONS PREFIX        //
/* *************************** */

const actionCreator = actionCreatorFactory('FORUM::POSTS');

/* *************************** */
//           ACTIONS           //
/* *************************** */

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

/* ********************************* */
//  STATE INTERFACE & INITIAL STATE  //
/* ********************************* */

export interface IState {
	isRequestingPostList: boolean;
	posts?: {
		[id: string]: PostType,
	};

	isRequestingPostsByCategory?: boolean;
	postsByCategory?: {
		[categoryName: string]: {
			[id: string]: PostType,
		},
	};

	isRequestingPostDetails?: boolean;
	isRequestingPostComments?: boolean;
	isRequestingPostAndCommentDetails: boolean;
	onDisplay: {
		post?: PostType,
		comments?: {
			[id: string]: CommentType,
		},
	};

	isRequestingCommentDetails?: boolean;
	commentDetail?: CommentType;
}

const INITIAL_STATE: IState = {
	isRequestingPostAndCommentDetails: false,
	isRequestingPostList: false,
	onDisplay: {}
};

/* *************************** */
//          SELECTORS          //
/* *************************** */

export const selectAllPosts: Selector<any> = ({ forumPosts }) => forumPosts.posts;
export const selectIsRequestingPostList: Selector<boolean> = ({ forumPosts }) => forumPosts.isRequestingPostList;
export const selectIsRequestingPostAndCommentDetails: Selector<boolean> = ({ forumPosts }) => forumPosts.isRequestingPostAndCommentDetails;
export const selectPostOnDisplayWithComments: Selector<{post?: PostType, comments?: {[id: string]: CommentType }}> = ({ forumPosts }) => forumPosts.onDisplay;

/* *************************** */
//           REDUCER           //
/* *************************** */

export default reducerWithInitialState(INITIAL_STATE)
	.case(getPosts.started, (state: IState) => ({ ...state, isRequestingPostList: true }))
	.case(getPosts.done, (state: IState, { result: posts }) => {
		const normalizedPosts = _.fromPairs(_.map(posts,(post:PostType) => [post.id,_.omit(post, 'id')]))
		return ({ 
			...state,
			posts: normalizedPosts,
			isRequestingPostList: false,
		})
	})
	.case(getPostsByCategory.started, (state: IState) => ({ ...state, isRequestingPostsByCategory: true }))
	.case(getPostsByCategory.done, (state: IState, { params: category, result: posts }) => {
		const normalizedPosts = _.fromPairs(_.map(posts,(post:PostType) => [post.id,_.omit(post, 'id')]))
		return ({
			...state,
			postsByCategory: {
				[category]: normalizedPosts
			},
			isRequestingPostsByCategory: false,
		})
	})
	.case(getPostDetails.started, (state: IState) => ({ ...state, isRequestingPostDetails: true, isRequestingPostAndCommentDetails: true }))
	.case(getPostDetails.done, (state: IState, { result: post }) => ({
		...state,
		onDisplay: {
			...state.onDisplay,
			post: { ...post },
		},
		isRequestingPostDetails: false,
}))
	.case(getPostComments.started, (state: IState) => ({ ...state, isRequestingPostComments: true }))
	.case(getPostComments.done, (state: IState, { result: comments }) => {
		const normalizedComments = _.fromPairs(_.map(comments,(comment:CommentType) => [comment.id,_.omit(comment, 'id')]))
		return ({
			...state,
			onDisplay: {
				...state.onDisplay,
				comments: normalizedComments,
			},
			isRequestingPostComments: false,
			isRequestingPostAndCommentDetails: false,
		}
	)})
	.case(getCommentDetails.started, (state: IState) => ({ ...state, isRequestingCommentDetails: true }))
	.case(getCommentDetails.done, (state: IState, { result: comment }) => ({
		...state,
		commentDetail: { ...comment },
	}))
	.build();

/* *************************** */
//            EPICS            //
/* *************************** */

const getPostsEpic: Epic = (action$) => action$.pipe(
	filter(getPosts.started.match),
	mergeMapTo(from(ApiSDK.getPosts()).pipe(
		map((posts) => getPosts.done({ result: posts })),
		catchError((error) => of(getPosts.failed({ error: error.code }))),
	)),
);

const getPostsByCategoryEpic: Epic = (action$) => action$.pipe(
	filter(getPostsByCategory.started.match),
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

const dispatchGetPostDetailsAfterSubmitCommentEpic: Epic = (action$) => action$.pipe(
	filter(submitComment.done.match),
	map(({ payload: { params: comment}}) => getPostDetails.started(comment.parentId))
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
	filter(getPostDetails.done.match),
	map(({payload:{result:post}}) => getPostComments.started(post.id)),
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
	dispatchGetPostDetailsAfterSubmitCommentEpic,
);
