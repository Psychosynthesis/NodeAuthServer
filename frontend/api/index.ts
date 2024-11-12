import { useCommonStore } from '@Store'

import { updateToken, getUser, register, login } from './auth';

import type { ServerResponse } from '@Commn/types';

const defaultResponse: ServerResponse = { error: true, data: null };

export const useAPI = () => {
  const [ state, dispatch ] = useCommonStore();

  return {
    updateToken: async () => {
      try {
        const response = await updateToken();
        if (response.error || !response.data) {
          return { ...defaultResponse, message: response.message };
        }
        return { ...defaultResponse, error: false, data: response.data };
      } catch (err) {
        return (err as Error).message;
      }
    },
    register: async (params) => {
      try {
        const response = await register(params)
        if (response.error || !response.data) {
          return { ...defaultResponse, message: response.message };
        }
        return { ...defaultResponse, error: false, data: response.data };
      } catch (err) {
        return (err as Error).message;
      }
    },
    login: async (params) => {
      try {
        const response = await login(params);
        if (!response.data || !response.data?.token || response.error) {
          return { ...defaultResponse, message: response.message };
        }
        return { ...defaultResponse, error: false, data: response.data };
      } catch (err) {
        return (err as Error).message;
      }
    },
    getUser: async () => {
      try {
        if (!state.token) { throw new Error('No token!') }
        const response = await getUser(state.token);
        if (!response.data || response.error) {
          return { ...defaultResponse, message: response.message };
        }
        return { ...defaultResponse, error: false, data: response.data };
      } catch (err) {
        return { ...defaultResponse, message: (err as Error).message };
      }
    },
  }
}
