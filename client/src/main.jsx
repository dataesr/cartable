import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NoticeProvider } from './libs/notice';
import { AuthProvider } from './hooks/useAuth';
import RootRoutes from './router';

import './styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NoticeProvider>
        <AuthProvider>
          <RootRoutes />
        </AuthProvider>
      </NoticeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
