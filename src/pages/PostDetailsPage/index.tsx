import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { map } from 'lodash';

import { Comment as CommentType, Post as PostType } from '../../declarations';
import { IRootState } from '../../store';

// ACTIONS AND SELECTORS
import { getPostDetails, selectIsRequestingPostAndCommentDetails, selectPostOnDisplayWithComments } from '../../store/forum/posts';

// COMPONENTS
// import { PostList } from '../../components';
import Spinner from '../../utils/Spinner';


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
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
	getPostDetails: (postId: string) => dispatch(getPostDetails.started(postId)),
})

class PostDetailsPage extends React.PureComponent<IMapStateToProps & IMapDispatchToProps> {
	public componentDidMount() {
		this.props.getPostDetails('8xf0y6ziyjabvozdd253nd');
	}

	public render() {
		const { isRequestingPostAndCommentDetails, onDisplay } = this.props;
		if (isRequestingPostAndCommentDetails || !onDisplay.post || !onDisplay.comments) {return (<Spinner color="#A4B3C1" size={10} />)};
		return(
			<div>
				<p>{onDisplay.post.author}</p>
				<p>{onDisplay.post.body}</p>
				{ map(onDisplay.comments, (comment) => <p>{comment.body}</p>)}
				<Spinner color="white" size={30} />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailsPage);