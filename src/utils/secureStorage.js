const setAuthData = (token, user) => {
  if (!token || !user) {
    console.error('Invalid auth data provided');
    return;
  }
  console.log('Setting auth data - Token:', token);
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
};

const clearAuthData = () => {
  console.log('Clearing auth data');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

const getAuthData = () => {
  try {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    console.log('Getting auth data - Token:', token);
    return { token, user };
  } catch (error) {
    console.error('Error getting auth data:', error);
    clearAuthData();
    return { token: null, user: {} };
  }
};

export { setAuthData, clearAuthData, getAuthData };

