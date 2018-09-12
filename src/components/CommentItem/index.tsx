import * as React from 'react';

import * as moment from 'moment';
import { Comment as CommentType } from '../../declarations';

const PostItem:React.StatelessComponent<{ comment: CommentType }> = ({ comment }) => (
	<div key={comment.id}>
		<div key={comment.id}>
			<i className="fas fa-sort-up"/>
			<p>{comment.voteScore}</p>
			<i className="fas fa-sort-down"/>
		</div>
		<div key={comment.id}>
				<p><span>{comment.author}</span> {moment().to(comment.timestamp)}</p>
				<p>{comment.body}</p>
		</div>
	</div>
)

export default PostItem;
