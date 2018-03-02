import ReactDOM from 'react-dom';
import React from 'react';
import renderer from 'react-test-renderer';
import Board from './board/board';
import DraggableBox from './board/draggable-box';

/**
 * @jest-environment node
*/
/* eslint-disable */
it('renders correctly', () => {
  const tree = renderer.create(<Board />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('generates boxes', () => {
  const doc = renderer.create(<Board />);
  const instance = doc.root.instance;
  const mockEvent = {
    target: { dataset: { type: 'text' } },
    clientX: 50,
    clientY: 50,
  };

  instance.generateBox(mockEvent);
  expect(doc.toJSON()).toMatchSnapshot();
});
