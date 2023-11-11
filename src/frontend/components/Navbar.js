import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";


const Navigation = ({ web3Handler, account }) => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          Content Monetization
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/create" className="nav-link">
              Create Post
            </Nav.Link>
            <Nav.Link as={Link} to="/myposts" className="nav-link">
              My Posts
            </Nav.Link>
          </Nav>
          <Nav>
            {account ? (
              <Nav.Link as={Link} to="/" className="button nav-button btn-sm mx-4">
                <Button variant="outline-light" className="account-button">
                  {account.slice(0, 7) + "..." + account.slice(38, 42)}
                </Button>
              </Nav.Link>
            ) : (
              <Button onClick={web3Handler} variant="outline-light">
                Connect Wallet
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;