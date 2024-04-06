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

    const authCheck = () => {
      const path = router.asPath.split('?')[0];
      if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
        router.push('/login');
      } else {
        updateAtoms();
      }
    };

    authCheck();

    // on route change complete - run auth check
    const handleRouteChange = () => authCheck();
    router.events.on('routeChangeComplete', handleRouteChange);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, setFavouritesList, setSearchHistoryList]);

  return isAuthenticated() ? children : null;
}
