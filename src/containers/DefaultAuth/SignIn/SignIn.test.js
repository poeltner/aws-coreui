import * as React from 'react';
import { shallow } from 'enzyme';
import Auth from '@aws-amplify/auth';
import DefaultSignIn from './SignIn';
import { Input, Button } from 'reactstrap';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => "" };
    return Component;
  },
}));

const acceptedStates = [
  'signIn',  
  'signedUp', 
  'signedOut',
  'customConfirmSignIn'
];

const fakeEvent = {
  preventDefault: jest.fn()
};

describe('SignIn', () => {
  describe('normal case', () => {
    test('render correctly with Props signIn, signedOut or signedUp', async () => {
        for (let i = 0; i < acceptedStates.length; i += 1){
            const wrapper = shallow(<DefaultSignIn/>);
            wrapper.setProps({
                authState: acceptedStates[i]
            });
            expect(wrapper).toMatchSnapshot();
        }
    });

    test('when clicking signIn and new password required', async () => {
      const wrapper = shallow(<DefaultSignIn />);
      wrapper.setProps({
          authState: 'signIn',
      });

      const spyon = jest.spyOn(Auth, 'signIn')
          .mockImplementationOnce((user, password) => {
              return new Promise((res, rej) => {
                  res({
                      challengeName: 'NEW_PASSWORD_REQUIRED'
                  });
              });
          });

      const event_username = {
          target: {
              name: 'username',
              value: 'user1'
          }
      };
      const event_password = {
          target: {
              name: 'password',
              value: 'abc'
          }
      };

      wrapper.find(Input).at(0).simulate('change', event_username);
      wrapper.find(Input).at(1).simulate('change', event_password);
      wrapper.find(Button).at(1).simulate('click');

      await Promise.resolve();
     
      expect(spyon.mock.calls.length).toBe(1);
      expect(spyon.mock.calls[0][0]).toBe(event_username.target.value);
      expect(spyon.mock.calls[0][1]).toBe(event_password.target.value);

      spyon.mockClear();
  });
  });
});
