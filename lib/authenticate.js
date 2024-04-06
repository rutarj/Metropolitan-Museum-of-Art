import { jwtDecode } from 'jwt-decode';

// Function to store the token in localStorage
export function setToken(token) {
    localStorage.setItem('access_token', token);
  }
  
  // Function to retrieve the token from localStorage
  export function getToken() {
    try {
      return localStorage.getItem('access_token');
    } catch (err) {
      return null;
    }
  }
  
  // Function to remove the token from localStorage
  export function removeToken() {
    localStorage.removeItem('access_token');
  }
  
  // Function to read the token and decode its payload
  export function readToken() {
    try {
      const token = getToken();
      return token ? jwtDecode(token) : null;
    } catch (err) {
      return null;
    }
  }
  
  // Function to check if the user is authenticated based on the token
  export function isAuthenticated() {
    const token = readToken();
    return token ? true : false;
  }
  
  // Function to authenticate a user by sending a POST request with username and password
  export async function authenticateUser(user, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ userName: user, password: password }),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    const data = await res.json();
  
    if (res.status === 200) {
      setToken(data.token);
      return true;
    } else {
      throw new Error(data.message);
    }
  }
  
  // Function to register a user by sending a POST request with username, password, and password2
  export async function registerUser(user, password, password2) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify({ userName: user, password, password2}),
      headers: {
        'content-type': 'application/json',
      },
    });
  
    const data = await res.json();
  
    if (res.status === 200) {
      return true;
    } else {
      throw new Error(data.message);
    }
  }