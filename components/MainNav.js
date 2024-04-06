// components/MainNav.js

import { Navbar, Nav, Form, FormControl, Button, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react'; 
import { useAtom } from 'jotai'; 
import { searchHistoryAtom } from '../store'; 
import { addToHistory } from '../lib/userData'; // Import addToHistory function
import { readToken, removeToken } from '@/lib/authenticate'; // Import readToken and removeToken functions

export default function MainNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); 

  // Function to handle logout
  const logout = () => {
    setIsExpanded(false); // Collapse the navbar
    removeToken(); // Remove the token
    router.push('/login'); // Redirect to login page
  };

  // Get token
  const token = readToken();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const searchField = e.target.search.value;
    if(searchField.trim() !== '') { 
      const queryString = `title=true&q=${encodeURIComponent(searchField)}`;
      // Use addToHistory to persist the search
      setSearchHistory(current => [...current, queryString]); 
      await addToHistory(queryString); // Add the search to history
      router.push(`/artwork?${queryString}`);
    }
    setIsExpanded(false); 
  };

  const collapseNavbar = () => setIsExpanded(false);

  return (
    <>
      <Navbar expanded={isExpanded} expand="lg" className="fixed-top navbar-dark bg-primary" onToggle={() => setIsExpanded(!isExpanded)}>
        <Container>
          <Navbar.Brand>Rutarj Shah</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior><Nav.Link onClick={collapseNavbar}>Home</Nav.Link></Link>
              {token && <Link href="/search" passHref legacyBehavior><Nav.Link onClick={collapseNavbar}>Advanced Search</Nav.Link></Link>}
            </Nav>
            &nbsp;
            <Form inline onSubmit={handleSearchSubmit} className="d-flex">
              <FormControl type="text" placeholder="Search" className="me-2" name="search" />
              <Button type="submit" variant="outline-success">Search</Button>
            </Form>
            &nbsp;
            <Nav>
              {token ? (
                <NavDropdown title={token.userName} id="nav-dropdown">
                  <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={collapseNavbar}>Favourites</NavDropdown.Item></Link>
                  <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={collapseNavbar}>Search History</NavDropdown.Item></Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav>
                  <Link href="/register" passHref legacyBehavior><Nav.Link onClick={collapseNavbar} active={router.pathname === '/register'}>Register</Nav.Link></Link>
                  <Link href="/login" passHref legacyBehavior><Nav.Link onClick={collapseNavbar} active={router.pathname === '/login'}>Login</Nav.Link></Link>
                </Nav>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
