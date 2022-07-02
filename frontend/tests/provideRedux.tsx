
import {render} from '@testing-library/react';
import {Provider} from 'react-redux';
import {store} from '../src/store/store';
import '@testing-library/jest-dom';

export const renderWithProvider = (children: any) => {
  const result = render(<Provider store={store}>
    {children}
  </Provider>);
  return result;
};
