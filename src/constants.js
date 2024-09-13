export let API_BASE_URL = '';

export const loadConfig = async () => {
  try {
    const response = await fetch('/config.json');
    const config = await response.json();
    API_BASE_URL = config.REACT_APP_API_BASE_URL;
    console.log("API Base URL set to:", API_BASE_URL);
  } catch (error) {
    console.error('Error loading config.json:', error);
  }
};