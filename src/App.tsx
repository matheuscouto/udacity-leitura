import * as React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

/* *************************** */
//            PAGES            //
/* *************************** */

import {
	IntroPage,
	PostDetailsPage,
	PostListPage
} from './pages';

/* *************************** */
//         INTERFACES          //
/* *************************** */

import { IRootState } from './store';

/* ****************************** */
//           SELECTORS            //
/* ****************************** */

import { selectUsername, selectVerifiedUsernameInLocalStorage } from './store/app/state';

/* *************************** */
//       COMPONENT CLASS       //
/* *************************** */

class App extends React.Component<IMapStateToProps> {
  public render() {
		const { username, verifiedUsernameInLocalStorage } = this.props;
		if(!verifiedUsernameInLocalStorage) { return <div/>}
		if(!username) { return <IntroPage/> }
    return (
      <div className="App">
				<Route exact path='/' component={PostListPage} />
				<Route exact path='/post/:postId' component={PostDetailsPage} />
      </div>
    );
  }
}

/* *************************** */
//      MAP STATE TO PROPS     //
/* *************************** */

interface IMapStateToProps {
	username?: string;
	verifiedUsernameInLocalStorage?: boolean;
};

const mapStateToProps = (state: IRootState): IMapStateToProps => ({
	username: selectUsername(state),
	verifiedUsernameInLocalStorage: selectVerifiedUsernameInLocalStorage(state),
});

export default withRouter<any>(connect(mapStateToProps)(App));
