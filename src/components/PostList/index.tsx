import * as React from 'react';

/* *************************** */
//          UTIL LIBS          //
/* *************************** */

import { map } from 'lodash';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { Post as PostType } from '../../declarations';

/* *************************** */
//     COMPONENTS IMPORTS      //
/* *************************** */

import PostItem from './PostItem';

/* *************************** */
//       COMPONENT PROPS       //
/* *************************** */

interface IProps {
	postList: {
		[id: string]: PostType,
	};
}

/* *************************** */
//       COMPONENT CLASS       //
/* *************************** */

class PostList extends React.PureComponent<IProps> {
	public render() {
		return(
			<div className="post-list">
				{
					map(this.props.postList, (post, id) => <PostItem post={post} postId={id} key={id}/>)
				}
			</div>
		);
	}
}

export default PostList;