import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData'; // Ensure this path is correct

const AdvancedSearch = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchBy, setSearchBy] = useState('');
  const [geoLocation, setGeoLocation] = useState('');
  const [medium, setMedium] = useState('');
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  const submitForm = async (data) => { // Make this async
    let queryString = "searchQuery=true";
    
    if (data.searchQuery) {
      queryString += `&q=${data.searchQuery}`;
    }
    if (searchBy) {
      queryString += `&searchBy=${searchBy}`;
    }
    if (geoLocation) {
      queryString += `&geoLocation=${geoLocation}`;
    }
    if (medium) {
      queryString += `&medium=${medium}`;
    }
  
    queryString += `&highlighted=${data.highlighted}`;
    queryString += `&currentlyOnView=${data.currentlyOnView}`;

    await addToHistory(queryString); // Use addToHistory to persist the search
    // Consider fetching updated history from backend here if needed
    router.push(`/artwork?${queryString}`);
  };
  
  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row className="mb-3">
        <Form.Group>
          <Form.Label>Search Query</Form.Label>
          <Form.Control type="text" {...register("searchQuery")} />
        </Form.Group>
      </Row>
      // Remainder of the component unchanged...
    </Form>
  );
}

export default AdvancedSearch;





