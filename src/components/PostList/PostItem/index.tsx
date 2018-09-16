import * as React from 'react';
import { Link } from 'react-router-dom';

/* *************************** */
//          UTIL LIBS          //
/* *************************** */

import * as moment from 'moment';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { Post as PostType } from '../../../declarations';

/* *************************** */
//       COMPONENT PROPS       //
/* *************************** */

interface IProps {
	post: PostType;
	postId: string;
}

/* *************************** */
//     COMPONENT FUNCTION      //
/* *************************** */

const PostItem:React.StatelessComponent<IProps> = (props) => {
	const { post, postId } = props;
	const voteScoreClassName = post.voteScore < 0 ? 'downvoted' : post.voteScore === 0 ? 'no-votes' : undefined;
	const iconClassName = post.voteScore < 0 ? 'down' : 'up';
	const commentCountClassName = post.commentCount > 0 ? undefined : 'no-comments';
	return(
		<div>
			<Link to={`/post/${postId}`}><h3>{post.title}</h3></Link>
			<div>
				<span className={commentCountClassName}>
					<i className="fas fa-comment-dots"/>
					{post.commentCount} respostas
				</span>
				<span className={voteScoreClassName}>
					<i className={`fas fa-arrow-${iconClassName}`} />
					{Math.abs(post.voteScore)} votos
				</span>
			</div>
			<div>
				<div>
					<div>
						{post.category}
					</div>
				</div>
				<p>Perguntado por <span>{post.author}</span> {moment().to(post.timestamp)}</p>
			</div>
		</div>
	);
}

export default PostItem;
