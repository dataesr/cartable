import PropTypes from 'prop-types';
import { useContext, useMemo, createContext } from 'react';
import Error from '../components/errors';
import { PageSpinner } from '../components/spinner';
import useFetch from '../hooks/useFetch';

const Ctx = createContext();

export function FoldersProvider({ children }) {
  const { data, isLoading, error, reload } = useFetch('/folders');
  const Folders = useMemo(() => ({
    findById: (id) => data?.find((folder) => folder._id === id),
    getAll: () => data,
    reload,
  }), [data, reload]);
  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <Ctx.Provider value={Folders}>
      {children}
    </Ctx.Provider>
  );
}
FoldersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFolders = () => useContext(Ctx);
