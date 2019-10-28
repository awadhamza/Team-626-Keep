import React from 'react';
import { shallow } from 'enzyme';
import Archive from './Archive';

describe('<Archive />', () => {
  test('renders', () => {
    const wrapper = shallow(<Archive />);
    expect(wrapper).toMatchSnapshot();
  });
});
