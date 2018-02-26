import ReactDOM from 'react-dom';
import React from 'react';
import renderer from 'react-test-renderer';
import Board from './board/board';

/**
 * @jest-environment node
*/

it('renders correctly', () => {
    const tree = renderer.create(<Board />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders button', () => {
  const tree = renderer.create(<Board />);
    tree.generateBox();
    expect(tree.toJSON()).toMatchSnapshot();
});



// eslint-disable-next-line no-undef
// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
