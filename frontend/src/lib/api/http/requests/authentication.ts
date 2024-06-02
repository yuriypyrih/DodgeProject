import { postRequest, getRequest, patchRequest } from '../index';

export const getMeRequest = () => {
  return getRequest('/users/me');
};

export const loginRequest = (email: string, password: string) => {
  return postRequest('/users/login', { email, password });
};

export const changeNamedRequest = (name: string) => {
  return patchRequest(`/users/name`, { name });
};

export const sendFeedbackRequest = (content: string) => {
  return postRequest(`/users/feedback`, { content });
};
export const forgotPasswordRequest = (email: string) => {
  return postRequest('/users/forgotPassword', { email });
};

export const resetPasswordRequest = (token: string, password: string) => {
  return patchRequest(`/users/resetPassword/${token}`, { password });
};

export const changePasswordRequest = (currentPassword: string, newPassword: string) => {
  return patchRequest('/users/changePassword', { passwordCurrent: currentPassword, password: newPassword });
};

export const registerRequest = (body: { name: string; email: string; password: string; passwordConfirm: string }) => {
  return postRequest('/users/signup', body);
};
