/* eslint-disable */
/**
 * @jest-environment node
*/

import React from 'react';
import renderer from 'react-test-renderer';
import Board from './board';
import ServerComm from '.././server-comm';
import DraggableBox from './draggable-box';
import ImageBox from './image-box';


// Implementation of websocket mock
const mockUpdateReceived = jest.fn();
const mockSendUpdateMsg = jest.fn();
const mockConnect = jest.fn();

jest.mock('.././server-comm', () => {
  return jest.fn().mockImplementation(() => {
    return ({
      setReceivedUpdateMessageHandler: mockUpdateReceived,
      sendUpdateMessage: mockSendUpdateMsg,
      connect: mockConnect,
    });
  });
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  ServerComm.mockClear();
  mockUpdateReceived.mockClear();
  mockSendUpdateMsg.mockClear();
  mockConnect.mockClear();
});


const mockData = {
  _id: 'test',
  elements: {
    testBox: {
      type: 'image',
      state: {
        x: 50,
        y: 50,
        w: 200,
        h: 200,
        z: 1,
        color: '#ffffff',
        text: '',
        src: 'test',
      },
    },
  },
};

const mockSocketMsg = {
  zIndex: 10,
  uuid: 'testBox',
  type: 'image',
  state: {
    x: 100,
    y: 100,
    w: 2000,
    h: 2000,
    z: 10,
    color: '#ffffff',
  }
}


it('renders correctly', () => {
  const tree = renderer.create(<Board data={mockData} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('generates boxes', () => {
  let doc = renderer.create(<Board data={mockData} />);
  let instance = doc.root.instance;
  instance.generateBox('text');
  expect(doc.toJSON()).toMatchSnapshot();
});

it('resizes images', () => {
  let doc = renderer.create(<Board data={mockData} />);
  let instance  = doc.root.instance;
  instance.updateImage('testBox', 750, 450);
  expect(instance.state.boxes.testBox.state.w).toEqual(500);
});

it('receives websocket updates', () => {
  let doc = renderer.create(<Board data={mockData} />);
  let instance  = doc.root.instance;
  instance.onUpdate(mockSocketMsg);
  expect(instance.state.boxes.testBox.state.h).toEqual(2000);
});

it('sends websocket updates', () => {
  let doc = renderer.create(<Board data={mockData} />);
  let instance  = doc.root.instance;
  instance.updateBoardState('testBox', {});
  expect(mockSendUpdateMsg).toHaveBeenCalledTimes(1);
});

it('resizes boxes correctly', () => {
  let doc = renderer.create(<DraggableBox callback={() => {}} uid={'1234'} />);
  let instance  = doc.root.instance;
  expect(instance.getResize(500, 600, 50)).toEqual(50);
});

it('resizes images on render', () => {
  function callbackFunc(uuid, w, h) {
    expect(w).toEqual(0);
    done();
  }
  const doc = renderer.create(<ImageBox w={200} h={200} src={'test'} uid={'1234'} imgCallback={callbackFunc} callback={() => {}} />);
});
