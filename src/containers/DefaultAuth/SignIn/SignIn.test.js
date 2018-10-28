import React from 'react';
import ReactDOM from 'react-dom';
import DefaultSignIn from './SignIn';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultSignIn />, div);
  ReactDOM.unmountComponentAtNode(div);
});
