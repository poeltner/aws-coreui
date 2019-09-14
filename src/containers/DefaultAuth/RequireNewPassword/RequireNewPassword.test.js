/* eslint-disable no-undef */
import React from 'react';
import { shallow } from 'enzyme';
import DefaultRequireNewPassword from './RequireNewPassword';

describe('RequireNewPassword', () => {
  describe('normal case', () => {
    test('render correctly', () => {
      const wrapper = shallow(<DefaultRequireNewPassword />);

      wrapper.setProps({
          authState: 'requireNewPassword',
          authData: {
              challengeParam: {
                  requiredAttributes: []
              }
          },
          hide: false
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});