import {
  FETCH_COMMANDS_PENDING, FETCH_COMMANDS_SUCCESS, FETCH_COMMANDS_ERROR,
} from '../actions';

const initialState = {
  pending: true,
  data: {},
  error: null,
};

// Format the data to fit the needs of Carbon.
function formatCommmandData(array) {
  const tableRows = array.map((item) => ({
    id: item?.metadata?.uid,
    name: item?.metadata?.annotations?.['kappnav-job-action-text'],
    status: item?.status?.succeeded,
    namespace: item?.metadata?.namespace,
  }));
  return tableRows;
}

const commandsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMMANDS_PENDING:
      return {
        ...state,
        pending: true,
      };
    case FETCH_COMMANDS_SUCCESS: {
      const formattedData = formatCommmandData(action.payload);
      return {
        ...state,
        pending: false,
        data: formattedData,
      };
    }
    case FETCH_COMMANDS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default commandsReducer;
