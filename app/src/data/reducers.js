import { ActionTypes } from './actions';

const board = (state = {}, action) => {
  switch (action.type) {
    if (action.type === ActionTypes.SET_POSITION) {
      return Object.assign(
        {},
        state,
        action.uid: {
          x: action.xPos,
          y: action.yPos,
        }
      )
    }
  }
}
