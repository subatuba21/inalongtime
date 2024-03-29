import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {UserState} from '../../store/user';

export const DontAllowIfLoggedIn = (props: any)
: React.ReactElement => {
  const userState = useSelector((state) => (state as any).user) as UserState;
  if (!userState.loggedIn) return <>{props.children}</>;
  else {
    return <Navigate to='/home' />;
  };
};
