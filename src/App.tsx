import * as React from 'react';

import { Route } from 'react-router-dom';

// Pages
import { PostListPage } from './pages';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
				<Route exact path='/' component={PostListPage} />
      </div>
    );
  }
}

export default App;
