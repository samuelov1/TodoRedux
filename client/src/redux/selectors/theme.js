const getThemeState = store => store.theme;

export const getDarkMode = store => {
  return getThemeState(store).darkMode;
};
