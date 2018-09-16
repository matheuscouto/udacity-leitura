import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';

/* *************************** */
//          UTIL LIBS          //
/* *************************** */

import * as moment from 'moment';
import * as uuid from 'uuid/v1';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { Comment as CommentType, Post as PostType } from '../../declarations';
import { IRootState } from '../../store';

/* ****************************** */
//  ACTIONS AND SELECTOS IMPORTS  //
/* ****************************** */

import { selectUsername } from '../../store/app/state';
import {
	getPostDetails,
	selectIsRequestingPostAndCommentDetails,
	selectPostOnDisplayWithComments,
	submitComment,
	voteComment,
	votePost,
} from '../../store/forum/posts';

/* *************************** */
//     COMPONENTS IMPORTS      //
/* *************************** */

import { CommentList } from '../../components';
import Spinner from '../../utils/Spinner';

/* *************************** */
//       COMPONENT CLASS       //
/* *************************** */

class PostDetailsPage extends React.PureComponent<IMapStateToProps & IMapDispatchToProps & RouteComponentProps<{postId: string}> > {
	public state = {
		commentInput: '',
	}

	public componentDidMount() {
		this.props.getPostDetails(this.props.match.params.postId);
	}

	public render() {
		const {
			isRequestingPostAndCommentDetails,
			onDisplay,
		} = this.props;

		/* RENDER SPINNER ON LOADING POST AND COMMENTS */
		if(isRequestingPostAndCommentDetails || !onDisplay.post || !onDisplay.comments) {
			return (<Spinner color="#A4B3C1" size={10} />)
		};

		return(
			<div className="post-details">

				{/* VOTE SESSION */}
			
				<div>
					<i className="fas fa-sort-up" onClick={this.handleVotePost('upVote')}/>
					<h1>{onDisplay.post.voteScore}</h1>
					<i className="fas fa-sort-down" onClick={this.handleVotePost('downVote')}/>
				</div>
				<div>

					{/* POST DETAILS SESSION */}

					<h2>{onDisplay.post.title}</h2>
					<div>
						<p>Perguntado por <span>{onDisplay.post.author}</span> em {moment(onDisplay.post.timestamp).format('LLL')}</p>
					</div>
					<div>{onDisplay.post.category}</div>
					<hr/>
					<p>{onDisplay.post.body}</p>

					<CommentList
						commentCount={onDisplay.post.commentCount}
						commentList={onDisplay.comments}
						commentInputValue={this.state.commentInput}
						handleInputChange={this.handleInputChange}
						handleCommentSubmit={this.handleCommentSubmit}
					/>
				</div>
			</div>
		);
	}

	private handleInputChange = (event: any) => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	private handleCommentSubmit = () => {
		if(this.props.username) {
			const comment:CommentType = {
				id: uuid(),
				parentId: this.props.onDisplay.post!.id,
				timestamp: Date.now(),
				body: this.state.commentInput,
				author: this.props.username,
			}
			this.props.submitComment(comment)
		}
	}

	private handleVotePost = (option: 'upVote' | 'downVote') => () => {
		const { postId } = this.props.match.params;
		this.props.votePost(postId, option);
	}
}

/* *************************** */
//      MAP STATE TO PROPS     //
/* *************************** */

interface IMapStateToProps {
	onDisplay: {
		post?: PostType,
		comments?: {
			[id: string]: CommentType,
		},
	};
	isRequestingPostAndCommentDetails: boolean;
	username: string | undefined;
};

const mapStateToProps = (state: IRootState): IMapStateToProps => ({
	onDisplay: selectPostOnDisplayWithComments(state),
	isRequestingPostAndCommentDetails: selectIsRequestingPostAndCommentDetails(state),
	username: selectUsername(state),
});

/* *************************** */
//    MAP DISPATCH TO PROPS    //
/* *************************** */

interface IMapDispatchToProps {
	getPostDetails: (postId: string) => void;
	submitComment: (comment: CommentType) => void;
	votePost: (postId: string, option: 'upVote' | 'downVote') => void;
	voteComment: (commentId: string, option: 'upVote' | 'downVote') => void;
};

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({
	getPostDetails: (postId) => dispatch(getPostDetails.started(postId)),
	submitComment: (comment) => dispatch(submitComment.started(comment)),
	votePost: (postId, option) => dispatch(votePost.started({postId, option})),
	voteComment: (commentId, option) => dispatch(voteComment.started({commentId, option})),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailsPage);