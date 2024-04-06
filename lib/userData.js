import { getToken } from './authenticate';

async function makeRequest(url, method = 'GET', body = null) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Fixed template literal here
  };

  const config = { method, headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    // Fixed template literal here for URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, config); 
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Function to add an item to favorites
export async function addToFavourites(id) {
  // Fixed template literal here for URL path
  return await makeRequest(`/favourites/${id}`, 'PUT');
}

// Function to remove an item from favorites
export async function removeFromFavourites(id) {
  // Fixed template literal here for URL path
  return await makeRequest(`/favourites/${id}`, 'DELETE');
}

// Function to retrieve the user's list of favorites
export async function getFavourites() {
  return await makeRequest('/favourites');
}

// Function to add an item to history
export async function addToHistory(id) {
  // Fixed template literal here for URL path
  return await makeRequest(`/history/${id}`, 'PUT');
}

// Function to remove an item from history
export async function removeFromHistory(id) {
  // Fixed template literal here for URL path
  return await makeRequest(`/history/${id}`, 'DELETE');
}

// Function to retrieve the user's history list
export async function getHistory() {
  return await makeRequest('/history');
}
