import { useEffect } from 'react';

const { VITE_APP_NAME } = import.meta.env;

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `${VITE_APP_NAME} · ${title}`;
  }, [title]);
}
