import * as React from 'react';

/* *************************** */
//          UTIL LIBS          //
/* *************************** */

import { map } from 'lodash';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { Comment as CommentType} from '../../declarations';

/* *************************** */
//     COMPONENTS IMPORTS      //
/* *************************** */

import CommentItem from './CommentItem';

/* *************************** */
//       COMPONENT PROPS       //
/* *************************** */

interface IProps {
	commentCount: number;
	commentList: { [id: string]: CommentType; };
	commentInputValue:  string;
	handleInputChange: (event: any) => void;
	handleCommentSubmit: () => void;
}

/* *************************** */
//       COMPONENT CLASS       //
/* *************************** */

class CommentList extends React.PureComponent<IProps> {
	public render() {
		const {
			commentCount,
			commentList,
			commentInputValue,
			handleInputChange,
			handleCommentSubmit
		} = this.props;
		return (
			<>
				<h3>{commentCount} Comentários</h3>
				<hr/>
				<div>
					{ map(commentList, (comment) => <CommentItem comment={comment} key={comment.id}/>) }
					<textarea maxLength={200} name="commentInput" value={commentInputValue} onChange={handleInputChange}/>
					<button onClick={handleCommentSubmit}>Enviar</button>
				</div>
			</>
		);
	}
}

export default CommentList;
