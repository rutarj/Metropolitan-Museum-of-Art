import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData'; // Import addToHistory function

const AdvancedSearch = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchBy, setSearchBy] = useState('');
  const [geoLocation, setGeoLocation] = useState('');
  const [medium, setMedium] = useState('');
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const submitForm = async (data) => {
    let queryString = "searchQuery=true";
    
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

    // Use addToHistory to persist the search
    setSearchHistory(await addToHistory(queryString));

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

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Search By</Form.Label>
            <select className="mb-3 form-select" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
              <option value="title">Title</option>
              <option value="tags">Tags</option>
              <option value="artistOrCulture">Artist or Culture</option>
            </select>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" value={geoLocation} onChange={(e) => setGeoLocation(e.target.value)} />
            <small className="text-muted form-text">
              &quot;Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc. ), with multiple values separated
              by the | operator&quot;
            </small>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" value={medium} onChange={(e) => setMedium(e.target.value)} />
            <small className="text-muted form-text">
              &quot;Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple
              values separated by the | operator&quot;
            </small>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Group>
          <Form.Check type="checkbox" label="Highlighted" {...register("highlighted")} />
        </Form.Group>
        
        <Form.Group>
          <Form.Check type="checkbox" label="Currently On View" {...register("currentlyOnView")} />
        </Form.Group>
      </Row>

      <Row>
        <Col><Button type="submit">Submit</Button></Col>
      </Row>
    </Form>
  );
}

export default AdvancedSearch;
