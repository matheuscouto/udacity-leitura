import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { map } from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid/v1';

import { Comment as CommentType, Post as PostType } from '../../declarations';
import { IRootState } from '../../store';

// ACTIONS AND SELECTORS
import { getPostDetails, selectIsRequestingPostAndCommentDetails, selectPostOnDisplayWithComments, submitComment } from '../../store/forum/posts';

// COMPONENTS
import { CommentItem } from '../../components';
import Spinner from '../../utils/Spinner';

class PostDetailsPage extends React.PureComponent<IMapStateToProps & IMapDispatchToProps> {
	public state = {
		commentInput: '',
	}

	public componentDidMount() {
		this.props.getPostDetails('8xf0y6ziyjabvozdd253nd');
	}

	public render() {
		const { isRequestingPostAndCommentDetails, onDisplay } = this.props;
		// RENDER SPINNER ON LOADING POST AND COMMENTS
		if (isRequestingPostAndCommentDetails || !onDisplay.post || !onDisplay.comments) {
			return (<Spinner color="#A4B3C1" size={10} />)
		};

		return(
			<div className="post-details">

				{/* VOTE SESSION */}
			
				<div>
					<i className="fas fa-sort-up"/>
					<h1>{onDisplay.post.voteScore}</h1>
					<i className="fas fa-sort-down"/>
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

					{/* COMMENTS SESSION */}
					
					<h3>{onDisplay.post.commentCount} Comentários</h3>
					<hr/>
					<div>
						{ map(onDisplay.comments, (comment) => <CommentItem comment={comment} key={comment.id}/>) }
						<textarea maxLength={200} name="commentInput" value={this.state.commentInput} onChange={this.handleInputChange}/>
						<button onClick={this.handleCommentSubmit}>Enviar</button>
					</div>
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
		const comment:CommentType = {
			id: uuid(),
			parentId: this.props.onDisplay.post!.id,
			timestamp: Date.now(),
			body: this.state.commentInput,
			author: 'thats me!',
		}
		this.props.submitComment(comment)
	}
}

interface IMapStateToProps {
	onDisplay: {
		post?: PostType,
		comments?: {
			[id: string]: CommentType,
		},
	};
	isRequestingPostAndCommentDetails: boolean;
};

const mapStateToProps = (state: IRootState): IMapStateToProps => ({
	onDisplay: selectPostOnDisplayWithComments(state),
	isRequestingPostAndCommentDetails: selectIsRequestingPostAndCommentDetails(state),
});

interface IMapDispatchToProps {
	getPostDetails: (postId: string) => void;
	submitComment: (comment: CommentType) => void;
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
	getPostDetails: (postId: string) => dispatch(getPostDetails.started(postId)),
	submitComment: (comment: CommentType) => dispatch(submitComment.started(comment)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailsPage);