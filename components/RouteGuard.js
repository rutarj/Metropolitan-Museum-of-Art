// components/RouteGuard.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { isAuthenticated } from '@/lib/authenticate';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS = ['/', '/login', '/register', '/_error'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistoryList] = useAtom(searchHistoryAtom);

  useEffect(() => {
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

    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  return isAuthenticated() ? children : null;
}
