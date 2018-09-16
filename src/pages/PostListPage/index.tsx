import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { Post as PostType } from '../../declarations';
import { IRootState } from '../../store';

/* ****************************** */
//  ACTIONS AND SELECTOS IMPORTS  //
/* ****************************** */

import { getPosts, selectAllPosts, selectIsRequestingPostList } from '../../store/forum/posts';

/* *************************** */
//     COMPONENTS IMPORTS      //
/* *************************** */

import { PostList } from '../../components';

/* *************************** */
//       COMPONENT CLASS       //
/* *************************** */

class PostListPage extends React.PureComponent<IMapStateToProps & IMapDispatchToProps> {
	public componentDidMount() {
		this.props.getPosts();
	}

	public render() {
		const { posts, isRequestingPostList } = this.props;
		return(
			<div>
				{
					isRequestingPostList
					? <div>Loading...</div>
					: <PostList postList={posts} />
				}
			</div>
		);
	}
}

/* *************************** */
//      MAP STATE TO PROPS     //
/* *************************** */

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

/* *************************** */
//    MAP DISPATCH TO PROPS    //
/* *************************** */

interface IMapDispatchToProps {
	getPosts: () => void;
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
	getPosts: () => dispatch(getPosts.started()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostListPage);