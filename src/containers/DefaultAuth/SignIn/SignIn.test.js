import * as React from 'react';
import { shallow } from 'enzyme';
// import Auth from '@aws-amplify/auth';
import DefaultSignIn from './SignIn';
// import { SignIn, AuthPiece } from 'aws-amplify-react';
// import { Input, Button } from 'reactstrap';

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

// const fakeEvent = {
//   preventDefault: jest.fn()
// };

describe('SignIn', () => {
  describe('normal case', () => {
    test('render correctly with Props signIn, signedOut or signedUp', async () => {
        for (let i = 0; i < acceptedStates.length; i += 1){
            const wrapper = await shallow(<DefaultSignIn/>);
            wrapper.setProps({
                authState: acceptedStates[i]
            });

            console.log(wrapper.debug());

            expect(wrapper).toMatchSnapshot();
        }
    });
  });
});
