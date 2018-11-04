import React from 'react';
import ReactDOM from 'react-dom';
import DefaultSignUp from './SignUp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultSignUp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
