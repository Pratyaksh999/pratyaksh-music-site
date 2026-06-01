// Admin email check utility
export const ADMIN_EMAIL = 'pratyakshbharadwaj@gmail.com';

export const isAdmin = (user) => {
  return user?.email === ADMIN_EMAIL;
};
