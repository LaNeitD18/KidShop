import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import * as serviceWorker from './serviceWorker';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';

Moment.globalMoment = moment;
Moment.globalLocale = 'vi';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={vi_VN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
