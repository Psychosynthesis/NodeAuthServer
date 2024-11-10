import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import './style.scss';

interface ErrorPageProps {
  isNoFound?: boolean;
}

export const ErrorPage = ({ isNoFound }: ErrorPageProps) => {
  if (isNoFound) {
    return (
      <div className="error-page">
        <h1>404</h1>
        <p>Sorry, page no found.</p>
      </div>
    );
  }

  const error = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    // @ts-ignore
    errorMessage = error.error?.message || error.statusText;
    // Гении-разработчики react-router-dom очередной раз поменяли способ работы с ошибками, нужно переписать

  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  console.error(error);

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
};
