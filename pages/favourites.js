import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { favouritesAtom } from '../store'; 
import { getFavourites, addToFavourites } from '../lib/userData';
import { Row, Col, Container, Button } from 'react-bootstrap';
import ArtworkCardDetail from '../components/ArtworkCardDetail';

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  useEffect(() => {
    // Asynchronously fetch the favourites list on component mount
    const fetchFavourites = async () => {
      const fetchedFavourites = await getFavourites();
      setFavouritesList(fetchedFavourites);
    };
    fetchFavourites();
  }, [setFavouritesList]); // Include setFavouritesList in the dependency array

  // Function to handle adding an item to favourites
  const handleAddToFavourites = async (id) => {
    try {
      // Call the function to add to favourites
      await addToFavourites(id);
      // After adding to favourites, update the favourites list
      setFavouritesList([...favouritesList, id]);
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  // If favouritesList is not available yet, return null
  if (!favouritesList) return null;

  return (
    <Container className="mt-5">
      <h1>Favourites</h1>
      {favouritesList.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {favouritesList.map((id) => (
            <Col key={id}>
              <ArtworkCardDetail objectID={id} />
              {/* Button to add to favourites */}
              <Button onClick={() => handleAddToFavourites(id)} variant="primary">
                Add to Favorites
              </Button>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No favourites yet. Start adding some!</p>
      )}
    </Container>
  );
}
