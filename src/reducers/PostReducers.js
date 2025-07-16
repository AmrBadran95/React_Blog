export const initialPostState = {
  posts: [],
  loading: false,
};

export const PostReducers = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_POSTS":
      return { ...state, posts: action.payload };

    case "ADD_POST":
      return { ...state, posts: [action.payload, ...state.posts] };

    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };

    case "DELETE_POST":
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };

    default:
      return state;
  }
};
