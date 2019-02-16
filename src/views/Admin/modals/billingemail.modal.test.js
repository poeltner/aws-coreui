import React from 'react';
import { shallow, mount } from 'enzyme';

import BillingEmailModal from './billingemail.modal';
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withNamespaces: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => "" };
    return Component;
  },
}));

describe('BillingEmailModal', () => {
  // it('should render correctly in "debug" mode', () => {
  //   const component = shallow(<BillingEmailModal debug />);
  //   expect(component).toMatchSnapshot();
  // });

  it('should through an error, if no email in input box', () => {
    let billingEmailModal = React.createRef();
    const wrapper = mount(<BillingEmailModal onRef={ref => (billingEmailModal = ref)} />);
    wrapper.setProps({ modal: true });

    console.log("Compoonent " + JSON.stringify(wrapper));
    const input = wrapper.find('email');
    console.log("input  " + JSON.stringify(input));
    input.simulate('change', { target: { value: 'Hello' } })
    expect(input.get(0).value).to.equal('Hello');
  });
});