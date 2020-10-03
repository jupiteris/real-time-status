/* eslint-disable no-param-reassign */
import produce from 'immer';
import { WAIT_CONTENT_PROCESS } from '../actions/uiActions';

const initialState = {
  content_process: false
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case WAIT_CONTENT_PROCESS: {
      return produce(state, (draft) => {
        draft.content_process = action.payload;
      });
    }
    default: {
      return state;
    }
  }
};

export default uiReducer;
