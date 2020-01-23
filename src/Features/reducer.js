export const reducer = (state, action) => {
  if (action.type === "login") {
    return {
      ...state,
      login: true
    };
  }
  if (action.type === "current-user-is") {
    return {
      ...state,
      user: action.content
    };
  }
  if (action.type === "logout") {
    return {
      ...state,
      login: false
    };
  }
  if (action.type === "get-messages") {
    return {
      ...state,
      messages: action.content
    };
  }
  if (action.type === "store-progress") {
    return {
      ...state,
      progress: action.content
    };
  }
  if (action.type === "fetched-user") {
    return {
      ...state,
      fetchedUser: action.content
    };
  }
  if (action.type === "store-friends-progress") {
    return { ...state, friendsProgress: action.content };
  }
  if (action.type === "progress-retrieved") {
    return {
      ...state,
      retrievedProgress: true
    };
  }
  if (action.type === "no-progress-retrieved") {
    return {
      ...state,
      retrievedProgress: false
    };
  }
  return state;
};
