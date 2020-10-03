export const WAIT_CONTENT_PROCESS = '@ui/wait-content-process';

export function waitContentProcess(process) {
  return async (dispatch) => {
    dispatch({
      type: WAIT_CONTENT_PROCESS,
      payload: process
    });
  };
}
