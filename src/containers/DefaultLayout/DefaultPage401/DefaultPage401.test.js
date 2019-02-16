import React from 'react';
import ReactDOM from 'react-dom';
import DefaultPage401 from './DefaultPage401';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DefaultPage401 />, div);
  ReactDOM.unmountComponentAtNode(div);
});
