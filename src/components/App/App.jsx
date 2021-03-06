import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Header from '../Header';
import Footer from '../Footer/Footer';
import AppWithRoutes from './indexAppWithRouter';
import Authorization from './Authorization';
import Loader from '../Loader';

import style from './App.module.scss';

const App = ({ token, isLoading }) => {
  const PageRoutes = token ? <AppWithRoutes /> : <Authorization />;

  return (
    <div className={style.App__wrapper}>
      <BrowserRouter>
        {token && <Header />}
        {isLoading && <Loader />}
        <div className={style['App__wrapper-component']}>{PageRoutes}</div>
        {token && <Footer />}
      </BrowserRouter>
    </div>
  );
};

App.defaultProps = {
  token: null,
};

App.propTypes = {
  token: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
};

export default App;
