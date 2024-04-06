// components/RouteGuard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { isAuthenticated } from '@/lib/authenticate'; // Adjust the import path as needed
import { favouritesAtom, searchHistoryAtom } from '@/store'; // Adjust the import path as needed
import { getFavourites, getHistory } from '@/lib/userData'; // Adjust the import path as needed

const PUBLIC_PATHS = ['/', '/login', '/_error', '/register'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistoryList] = useAtom(searchHistoryAtom);

  useEffect(() => {
    // Function to update atoms
    const updateAtoms = async () => {
      if (isAuthenticated()) {
        const favourites = await getFavourites();
        setFavouritesList(favourites);
        const history = await getHistory();
        setSearchHistoryList(history);
      }
    };

    const authCheck = (url) => {
      const path = url.split('?')[0];
      if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
        router.push('/login');
      } else {
        updateAtoms();
      }
    };

    authCheck(router.asPath);

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck);
    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return isAuthenticated() ? children : null;
}
