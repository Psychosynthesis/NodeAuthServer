import { createContext, useContext, useReducer } from 'react';
import { appReducer } from './reducers';

import { StoreType, Dispatch, AppStoreProviderProps, StoreManagerType } from './types';

const AppStateContext = createContext<StoreType | undefined>(undefined)
const AppDispatchContext = createContext<Dispatch | undefined>(undefined)

export const initStore = {
  user: {
    username: null,
    userId: null,
    email: null,
    telegramUsername: null,
    telegramId: null,
  },
  token: null,
  error: [],
  networkError: null,
}



const AppStoreProvider = ({children}: AppStoreProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initStore);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

const useAppState = () => {
  const context = useContext(AppStateContext);
  if (typeof(context) === 'undefined') {
    throw new Error('useAppState must be used within a AppStoreProvider')
  }
  return context;
}

const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (typeof(context) === 'undefined') {
    throw new Error('useAppDispatch must be used within a AppStoreProvider')
  }
  return context
}

const useCommonStore = ():StoreManagerType => {
  // Сахар для компонентов где нужен и стор и диспатч.
  // Использование: const [state, dispatch] = useCommonStore();
  return [useAppState(), useAppDispatch()];
}

export { AppStoreProvider, useAppState, useAppDispatch, useCommonStore }
