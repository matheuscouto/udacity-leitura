import * as React from 'react';
import { Route } from 'react-router-dom';

// Pages
import { PostDetailsPage, PostListPage } from './pages';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
				<Route exact path='/' component={PostListPage} />
				<Route exact path='/post/:postId' component={PostDetailsPage} />
      </div>
    );
  }
}

export default App;
