/* eslint-disable no-undef */
import React from 'react';
// import ReactDOM from 'react-dom';
import AdminSettingsView from './admin.billing.view';
import { shallow } from 'enzyme'

// jest.mock('react-chartjs-2', () => ({
//   Line: () => null,
//   Bar: () => null
// }));

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<AdminSettingsView />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

it('renders without crashing', () => {
  shallow(<AdminSettingsView />);
});
