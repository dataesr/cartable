import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, SwitchTheme } from '@dataesr/react-dsfr';
import Header from './header';
import Footer from './footer';
import useAuth from '../hooks/useAuth';
import { PageSpinner } from '../components/spinner';
import ScrollToTop from './scroll-to-top-button';

import './layout.scss';
import { UsersProvider } from '../contexts/UsersContext';
import { FoldersProvider } from '../contexts/FoldersContext';

export default function Layout() {
  const [isSwitchThemeOpen, setIsSwitchThemeOpen] = useState(false);
  const { isLoading, viewer } = useAuth();
  return (
    <>
      <Header />
      <SwitchTheme isOpen={isSwitchThemeOpen} setIsOpen={setIsSwitchThemeOpen} />
      <div role="alert" id="notice-container" />
      <Container as="main" role="main" fluid>
        {isLoading && <Container spacing="py-10w"><PageSpinner size={96} /></Container>}
        {(!isLoading && (viewer.role === 'admin')) && (
          <UsersProvider>
            <FoldersProvider>
              <Outlet />
            </FoldersProvider>
          </UsersProvider>
        )}
        {(!isLoading && (viewer.role !== 'admin')) && (
          <FoldersProvider>
            <Outlet />
          </FoldersProvider>
        )}
      </Container>
      <ScrollToTop />
      <Footer switchTheme={{ isOpen: isSwitchThemeOpen, setIsOpen: setIsSwitchThemeOpen }} />
    </>
  );
}
