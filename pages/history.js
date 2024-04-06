// Assuming removeFromHistory function exists in userData.js and correctly communicates with your backend
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { Button, ListGroup, Card } from 'react-bootstrap';
import { searchHistoryAtom } from '../store';
import { getHistory, removeFromHistory } from '../lib/userData'; // Import getHistory and removeFromHistory functions
import styles from '../styles/History.module.css';

export default function History() {
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const [loading, setLoading] = useState(true); // Add a loading state to manage async operations
  const router = useRouter();

  // Fetch history from the backend on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getHistory();
      setSearchHistory(history);
      setLoading(false); // Indicate loading is complete
    };
    fetchHistory();
  }, [setSearchHistory]);

  const historyClicked = (e, index) => {
    e.preventDefault();
    router.push(`/artwork?${searchHistory[index]}`);
  };

  // Modify to be async and use removeFromHistory function
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation();
    await removeFromHistory(searchHistory[index]);
    const updatedHistory = await getHistory(); // Re-fetch updated history list
    setSearchHistory(updatedHistory);
  };

  if (loading) return <div>Loading...</div>; // Show loading indicator while fetching

  return (
    <>
      {searchHistory && searchHistory.length > 0 ? (
        <ListGroup>
          {searchHistory.map((historyItem, index) => (
            <ListGroup.Item key={index} className={styles.historyListItem} onClick={e => historyClicked(e, index)}>
              {Object.keys(historyItem).map(key => (
                <span key={key}>{key}: <strong>{historyItem[key]}</strong>&nbsp;</span>
              ))}
              <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>Nothing Here. Try searching for some artwork.</Card.Body>
        </Card>
      )}
    </>
  );
}
