import axios from 'axios';
import { Comment as CommentType, Post as PostType } from '../declarations';

// API CONFIGURATION VARIABLES

const apiBaseUrl = "http://localhost:1950";

let token = localStorage.getItem('token');
if (!token){
	localStorage.setItem('token', Math.random().toString(36).substr(-8));
	token = localStorage.getItem('token');
};

const headers = {
  'Accept': 'application/json',
  'Authorization': token,
};

// RETURN ALL POST CATEGORIES

const getCategories = async (): Promise<any>  => 
	await axios.get(`${apiBaseUrl}/categories`, { headers })
		.then(({ data: { categories }}) => categories)

// RETURN ALL POSTS

const getPosts = async (): Promise<any>  => 
	await axios.get(`${apiBaseUrl}/posts`, { headers })
		.then(({ data: posts }) => posts)

// RETURN ALL POSTS OF A SINGLE CATEGORY

const getPostsByCategory = async (category: string): Promise<any> =>
	await axios.get(`${apiBaseUrl}/${category}/posts`, { headers })
		.then(({ data: posts }) => posts)

// SUBMIT A SINGLE POST

const submitPost = async (post: PostType): Promise<any> =>
	await axios.post(`${apiBaseUrl}/posts`, {...post}, { headers })
		.then((response) => response)

// RETURN DETAILS OF A SINGLE POST

const getPostDetails = async (postId: string): Promise<any>  => 
	await axios.get(`${apiBaseUrl}/posts/${postId}`, { headers })
		.then(({ data: post }) => post)

// SUBMIT VOTE FOR A SINGLE POST

const votePost = async (postId: string, option:'upVote' | 'downVote'): Promise<any> =>
	await axios.post(`${apiBaseUrl}/posts/${postId}`, { option }, { headers })
		.then((response) => response)

// EDIT A SINGLE POST

const editPost = async (postId:string, title:string, body:string): Promise<any> =>
	await axios.put(`${apiBaseUrl}/posts/${postId}`,{ title, body }, { headers })
		.then((response) => response)

// DELETE POST

const deletePost = async (postId: string): Promise<any>  => 
	await axios.delete(`${apiBaseUrl}/posts/${postId}`, { headers })
		.then((response) => response)

// RETURN ALL COMMENTS FROM A SINGLE POST

const getPostComments = async (postId: string): Promise<any>  => 
	await axios.get(`${apiBaseUrl}/posts/${postId}/comments`, { headers })
		.then(({ data: comments }) => comments)

// SUBMIT VOTE FOR A SINGLE COMMENT

const voteComment = async (commentId: string, option:'upVote' | 'downVote'): Promise<any> =>
	await axios.post(`${apiBaseUrl}/comments/${commentId}`, { option }, { headers })
		.then((response) => response)

// SUBMIT A SINGLE COMMENT

const submitComment = async (comment: CommentType): Promise<any> =>
	await axios.post(`${apiBaseUrl}/comments`, {...comment}, { headers })
		.then((response) => response)

// RETURN DETAILS OF A SINGLE COMMENT

const getCommentDetails = async (commentId: string): Promise<any>  => 
	await axios.get(`${apiBaseUrl}/comments/${commentId}`, { headers })
		.then(({ data: comment }) => comment)

// EDIT A SINGLE COMMENT

const editComment = async (commentId:string, timestamp:number, body:string): Promise<any> =>
	await axios.put(`${apiBaseUrl}/comments/${commentId}`,{ timestamp, body }, { headers })
		.then((response) => response)

// DELETE POST

const deleteComment = async (commentId: string): Promise<any>  => 
	await axios.delete(`${apiBaseUrl}/comments/${commentId}`, { headers })
		.then((response) => response)

export default { 
	getCategories,
	getPosts,
	getPostsByCategory,
	submitPost,
	getPostDetails,
	votePost,
	editPost,
	deletePost,
	getPostComments,
	voteComment,
	submitComment,
	getCommentDetails,
	editComment,
	deleteComment,
}
