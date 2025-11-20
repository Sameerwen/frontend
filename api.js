// Deployed backend online
const BASE_URL = 'https://backend-vp34.onrender.com';  

// Fetch all lessons from backend
export async function getLessons() {
  try {
    const response = await fetch(`${BASE_URL}/lessons`);
    if (!response.ok) throw new Error(`Failed to fetch lessons: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
}

// Search lessons dynamically
export async function searchLessons(query) {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching lessons:', error);
    throw error;
  }
}

// Submit a new order to backend
export async function postOrder(order) {
  try {
    const response = await fetch(`${BASE_URL}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error(`Failed to submit order: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error posting order:', error);
    throw error;
  }
}

// Update lesson spaces after adding/removing from cart
export async function updateLessonSpaces(lessonId, spaces) {
  try {
    const response = await fetch(`${BASE_URL}/update/${lessonId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spaces }),
    });
    if (!response.ok) throw new Error(`Failed to update lesson: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
}
