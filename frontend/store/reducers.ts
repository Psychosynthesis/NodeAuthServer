import { StoreType, Action } from "./types";
import { initStore } from './index';

export const appReducer = (state: StoreType, action: Action) => {
  switch (action.type) {
  	case 'setUserData': {
  	  return { ...state, user: action.load }
  	}

    case 'clearUserData': {
      return { ...state, user: { ...initStore.user } }
    }

    case 'setToken': {
      return { ...state, token: action.load }
    }

    case 'clearError': {
      return { ...state, error: [], networkError: null }
    }

    case 'pushError': {
      return { ...state, error: [...state.error, action.load] }
    }

    case 'setNetworkError': {
      return { ...state, networkError: action.load }
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
