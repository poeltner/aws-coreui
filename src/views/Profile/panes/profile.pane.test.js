import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr } from '../../../../test/testUtils';

import ProfilePane from './profile.pane';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * Factory function to create a ShallowWrapper for the App component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
*/
const setup = (props={}, state=null) => {
//   const wrapper = shallow(<ProfilePane t={key => key} {...props} />)
//   console.log('tst1' + wrapper.debug({ ignoreProps: true }));
    // const outer = shallow(<ProfilePane />); 
    // const wrapper = outer.props().children({ /* context */ });
    // const Children = outer.prop('children')
    const wrapper = mount(<ProfilePane />)
    console.log(wrapper.debug())
    console.log('tst1' + JSON.stringify(wrapper));
  if (state) wrapper.setState(state);
  return wrapper;
}

const shallowRenderProps = (Component, injectedProps) => {
    const outer = shallow(Component)
    const Children = outer.prop('children')
    const childrenWrapper = shallow(<Children{...injectedProps}/>)
    const wrapper = childrenWrapper.shallow()
  
    return wrapper
}

test('renders without error', () => {
    // const wrapper = setup();
    const wrapper = shallowRenderProps(<ProfilePane/>,{})
    const appComponent = findByTestAttr(wrapper, 'component-app');
    console.log('tst' + wrapper.debug())
    expect(appComponent.length).toBe(1);
});
