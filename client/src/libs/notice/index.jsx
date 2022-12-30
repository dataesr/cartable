import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Notice from './Notice';

const NoticeContext = createContext();

export function NoticeProvider({ children }) {
  const [currentNotice, setCurrentNotice] = useState(null);
  const remove = useCallback(() => { setCurrentNotice(null); }, []);
  const notice = useCallback((noticeObject) => { setCurrentNotice(noticeObject); }, []);
  const value = useMemo(() => ({ notice, remove }), [notice, remove]);

  return (
    <NoticeContext.Provider value={value}>
      { currentNotice && createPortal(
        (<div>{currentNotice && (<Notice remove={remove} {...currentNotice} />)}</div>),
        document.getElementById('notice-container'),
      )}
      {children}
    </NoticeContext.Provider>
  );
}

NoticeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook
// ==============================
export const useNotice = () => useContext(NoticeContext);
