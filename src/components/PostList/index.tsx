import * as React from 'react';

import { map } from 'lodash';

import { Post as PostType } from '../../declarations';

import PostItem from './PostItem';

interface IProps {
	postList: {
		[id: string]: PostType,
	};
}

class PostList extends React.PureComponent<IProps> {
	public render() {
		return(
			<div className="post-list">
				{
					map(this.props.postList,post => <PostItem post={post} />)
				}
			</div>
		);
	}
}

export default PostList;