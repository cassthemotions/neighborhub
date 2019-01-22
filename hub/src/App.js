import React, { Component } from 'react';
import Amplify, { Analytics, Storage, API, graphqlOperation } from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
Amplify.configure(aws_exports);

class App extends Component {
  get = async () => {
    console.log('calling api');
    const response = await API.get('apicceee9ce', '/messages');
    alert(JSON.stringify(response, null, 2));
  }

  render() {
    return (
      <div className="App">
        <h1>hello world</h1>
        <button onClick={this.get}>GET</button>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
