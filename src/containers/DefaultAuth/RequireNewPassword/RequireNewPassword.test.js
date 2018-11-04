import React from 'react';
import ReactDOM from 'react-dom';
import DefaultRequireNewPassword from './RequireNewPassword';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultRequireNewPassword />, div);
  ReactDOM.unmountComponentAtNode(div);
});
