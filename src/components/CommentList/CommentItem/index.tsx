import * as React from 'react';

/* *************************** */
//          UTIL LIBS          //
/* *************************** */

import * as moment from 'moment';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { Comment as CommentType } from '../../../declarations';

/* *************************** */
//     COMPONENT FUNCTION      //
/* *************************** */

const CommentItem:React.StatelessComponent<{ comment: CommentType }> = ({ comment }) => (
	<div>
		<div>
			<i className="fas fa-sort-up"/>
			<p>{comment.voteScore}</p>
			<i className="fas fa-sort-down"/>
		</div>
		<div>
				<p><span>{comment.author}</span> {moment().to(comment.timestamp)}</p>
				<p>{comment.body}</p>
		</div>
	</div>
)

export default CommentItem;
