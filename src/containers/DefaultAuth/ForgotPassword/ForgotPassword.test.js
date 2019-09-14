import React from 'react';
import { shallow } from 'enzyme';
import DefaultForgotPassword from './ForgotPassword';

const acceptedStates = [
  'forgotPassword'
];

describe('forgotPassword', () => {
  describe('normal case', () => {
      test('render correctly with authState forgotPassword', () => {
          for (let i = 0; i < acceptedStates.length; i += 1){
              const wrapper = shallow(<DefaultForgotPassword/>);
              wrapper.setProps({
                  authState: acceptedStates[i],
              });
              expect(wrapper).toMatchSnapshot();
          }
      });
    });
});
