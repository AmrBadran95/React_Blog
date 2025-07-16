export const initialUserState = {
  currentUser: null,
  error: null,
  loading: true,
};

export const UserReducers = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        currentUser: action.payload,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "CLEAR_LOADING":
      return { ...state, loading: false };
    case "SIGN_OUT":
      return { ...initialUserState, loading: false };
    default:
      return state;
  }
};
