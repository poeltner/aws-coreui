import React from 'react';
import ReactDOM from 'react-dom';
import DefaultConfirmSignUp from './ConfirmSignUp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultConfirmSignUp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
