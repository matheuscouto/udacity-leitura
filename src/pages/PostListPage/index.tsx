import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Post as PostType } from '../../declarations';
import { IRootState } from '../../store';

// ACTIONS AND SELECTORS
import { getPosts, selectAllPosts, selectIsRequestingPostList } from '../../store/forum/posts';

// COMPONENTS
import { PostList } from '../../components';


interface IMapStateToProps {
	posts: {
		[id: string]: PostType,
	};
	isRequestingPostList: boolean
};

const mapStateToProps = (state: IRootState): IMapStateToProps => ({
	posts: selectAllPosts(state),
	isRequestingPostList: selectIsRequestingPostList(state),
});

interface IMapDispatchToProps {
	getPosts: () => void;
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
	getPosts: () => dispatch(getPosts.started()),
})

class PostListPage extends React.PureComponent<IMapStateToProps & IMapDispatchToProps> {
	public componentDidMount() {
		this.props.getPosts();
	}

	public render() {
		const { posts, isRequestingPostList } = this.props;
		return(
			<ul>
			{
				isRequestingPostList
				? <div>Loading...</div>
				: <PostList postList={posts} />
			}
				
			</ul>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PostListPage);