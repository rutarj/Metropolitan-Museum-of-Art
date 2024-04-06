import { useState } from 'react';
import { Card, Form, Alert, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { authenticateUser } from '@/lib/authenticate';
import { getFavourites, getHistory } from '@/lib/userData';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store'; // Assuming you have defined these atoms in store.js

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Authenticate user
      await authenticateUser(user, password);
      
      // Update favourites and search history
      await updateAtoms();

      // Redirect to favourites page
      router.push('/favourites');
    } catch (err) {
      // Handle authentication error
      setWarning(err.message);
    }
  };

  const updateAtoms = async () => {
    // Fetch favourites and search history data
    const favourites = await getFavourites();
    const history = await getHistory();
    
    // Update atom values
    setFavouritesList(favourites);
    setSearchHistory(history);
  };

  return (
    <>
      <Card bg="light">
        <Card.Body>
          <h2>Login</h2>
          <p>Enter your login information below:</p>
        </Card.Body>
      </Card>
      <br />
      <Form onSubmit={handleSubmit}>
        {warning && (
          <>
            <br />
            <Alert variant="danger">{warning}</Alert>
          </>
        )}
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button variant="primary" className="pull-right" type="submit">
          Login
        </Button>
      </Form>
    </>
  );
}
