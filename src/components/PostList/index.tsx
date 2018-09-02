import * as React from 'react';

import { map } from 'lodash';

import { Post as PostType } from '../../declarations';

interface IProps {
	postList: {
		[id: string]: PostType,
	};
}

class PostList extends React.PureComponent<IProps> {
	public render() {
		return(
			<ul>
				{
					map(this.props.postList,post =><li>{post.title}<br/>{post.body}<br/>{post.author}</li>)
				}
			</ul>
		);
	}
}

export default PostList;