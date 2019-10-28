import React from 'react';
import { shallow } from 'enzyme';
import HomePage from './HomePage';

describe('<HomePage />', () => {
  test('renders', () => {
    const wrapper = shallow(<HomePage />);
    expect(wrapper).toMatchSnapshot();
  });
});
