import * as React from 'react';

import * as moment from 'moment';

import { Post as PostType } from '../../../declarations';

interface IProps {
	post: PostType;
}

class PostItem extends React.PureComponent<IProps> {
	public render() {
		const { post } = this.props;
		const voteScoreClassName = post.voteScore < 0 ? 'downvoted' : post.voteScore === 0 ? 'no-votes' : undefined;
		const iconClassName = post.voteScore < 0 ? 'down' : 'up';
		const commentCountClassName = post.commentCount > 0 ? undefined : 'no-comments';
		return(
			<div key={post.id}>
				<h3>{post.title}</h3>
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
}

export default PostItem;
