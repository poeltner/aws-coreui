import React from 'react';
import ReactDOM from 'react-dom';
import DefaultForgotPassword from './ForgotPassword';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultForgotPassword />, div);
  ReactDOM.unmountComponentAtNode(div);
});
