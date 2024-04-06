import { Navbar, Nav, Form, FormControl, Button, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react'; 
import { useAtom } from 'jotai'; 
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData'; // Make sure this path is correct
import { readToken, removeToken } from '../lib/authenticate'; // Import the authentication functions

export default function MainNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const token = readToken(); // Read the token

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const searchField = e.target.search.value.trim();
    if (searchField) {
      const queryString = `title=true&q=${encodeURIComponent(searchField)}`;
      await addToHistory(queryString);
      router.push(`/artwork?${queryString}`);
    }
    setIsExpanded(false); 
  };

  const logout = () => {
    setIsExpanded(false);
    removeToken(); // Remove token on logout
    router.push('/login'); // Redirect to login page
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
              <Link href="/" passHref><Nav.Link onClick={collapseNavbar}>Home</Nav.Link></Link>
              {token && <Link href="/search" passHref><Nav.Link onClick={collapseNavbar}>Advanced Search</Nav.Link></Link>}
            </Nav>
            {token ? (
              <>
                <Form inline onSubmit={handleSearchSubmit} className="d-flex">
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" name="search" />
                  <Button type="submit" variant="outline-success">Search</Button>
                </Form>
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav>
                <Link href="/register" passHref><Nav.Link onClick={collapseNavbar} active={router.pathname === '/register'}>Register</Nav.Link></Link>
                <Link href="/login" passHref><Nav.Link onClick={collapseNavbar} active={router.pathname === '/login'}>Login</Nav.Link></Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
