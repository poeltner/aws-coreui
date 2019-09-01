import * as React from 'react';
import { shallow, mount} from 'enzyme';
import Auth from '@aws-amplify/auth';
import DefaultSignIn from './SignIn';
import { SignIn, AuthPiece } from 'aws-amplify-react';
import { Input, Button } from 'reactstrap';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<DefaultSignIn />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

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
      test('render correctly with Props signIn, signedOut or signedUp', () => {
          for (let i = 0; i < acceptedStates.length; i += 1){
              const wrapper = shallow(<DefaultSignIn/>);
              wrapper.setProps({
                  authState: acceptedStates[i]
              });

              expect(wrapper).toMatchSnapshot();
          }
      });

      test('when clicking signIn and new password required', async () => {
        const wrapper = shallow(<DefaultSignIn authState="signIn"/>);
        // wrapper.setProps({
        //     authState: 'signIn'
        // });

        const spyon = jest.spyOn(Auth, 'signIn')
            .mockImplementationOnce((user, password) => {
                return new Promise((res, rej) => {
                    res({
                        challengeName: 'NEW_PASSWORD_REQUIRED'
                    });
                });
            });

        const spyon_changeState = jest.spyOn(AuthPiece.prototype, 'changeState');

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

        console.log(wrapper.debug());

        wrapper.find(Input).at(0).simulate('change', event_username);
        wrapper.find(Input).at(1).simulate('change', event_password);
        wrapper.find(Button).at(1).simulate('submit', fakeEvent);

        await Promise.resolve();
       
        expect(spyon.mock.calls.length).toBe(1);
        expect(spyon.mock.calls[0][0]).toBe(event_username.target.value);
        expect(spyon.mock.calls[0][1]).toBe(event_password.target.value);

        expect(spyon_changeState).toBeCalled();
        expect(spyon_changeState.mock.calls[0][0]).toBe('requireNewPassword');

        spyon.mockClear();
        spyon_changeState.mockClear();
    });

  });
});
