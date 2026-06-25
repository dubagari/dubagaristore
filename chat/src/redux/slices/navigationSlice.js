import { createSlice } from '@reduxjs/toolkit';

const getInitialDarkMode = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved === 'dark';
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    activeTab: 'dashboard',
    darkMode: getInitialDarkMode()
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }
  }
});

export const { setActiveTab, toggleDarkMode } = navigationSlice.actions;
export default navigationSlice.reducer;
