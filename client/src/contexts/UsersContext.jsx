import PropTypes from 'prop-types';
import { useContext, useMemo, createContext } from 'react';
import Error from '../components/errors';
import { PageSpinner } from '../components/spinner';
import useFetch from '../hooks/useFetch';

const Ctx = createContext();

export function UsersProvider({ children }) {
  const { data, isLoading, error, reload } = useFetch('/users');

  const Users = useMemo(() => ({
    findById: (id) => data.find((user) => user._id === id),
    getAll: () => data,
    reload,
  }), [data, reload]);
  if (isLoading) return <PageSpinner />;
  if (error) return <Error />;

  return (
    <Ctx.Provider value={Users}>
      {children}
    </Ctx.Provider>
  );
}

UsersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUsers = () => useContext(Ctx);
