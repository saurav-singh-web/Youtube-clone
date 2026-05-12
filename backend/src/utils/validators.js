const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = ({ username, email, password }) => {
  if (!username || username.trim().length < 3) {
    return "Username must be at least 3 characters long.";
  }

  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long.";
  }

  return null;
};

export const validateLoginInput = ({ email, password }) => {
  if (!email || !emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!password) {
    return "Password is required.";
  }

  return null;
};

