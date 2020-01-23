export const defaultState = {
  login: false,
  user: undefined,
  tags: [],
  messages: [],
  gifUrls: [],
  retrievedProgress: false,
  progress: { user: "", habits: [], dailies: [] },
  friendsProgress: { user: "", habits: [], dailies: [] },
  fetchedUser: undefined
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    console.log(error);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return defaultState;
    return JSON.parse(serializedState);
  } catch (error) {
    console.log(error);
    return defaultState;
  }
};
