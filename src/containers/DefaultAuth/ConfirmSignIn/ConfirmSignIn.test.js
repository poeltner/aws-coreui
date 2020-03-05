import React from 'react';
import ReactDOM from 'react-dom';
import DefaultConfirmSignIn from './ConfirmSignIn';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultConfirmSignIn />, div);
  ReactDOM.unmountComponentAtNode(div);
});
