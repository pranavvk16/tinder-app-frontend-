import axios from 'axios';

import { API_BASE_URL } from '@env';
console.log('Loaded API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

export const getRecommendedPeople = async (per_page = 15) => {
  try {
    const response = await api.get(`/people/recommended`, {
      params: { per_page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended people:', error);
    throw error;
  }
};

export const likePerson = async (id) => {
  try {
    const response = await api.post(`/people/${id}/like`);
    return response.data;
  } catch (error) {
    console.error(`Error liking person with ID ${id}:`, error);
    throw error;
  }
};

export const dislikePerson = async (id) => {
  try {
    const response = await api.post(`/people/${id}/dislike`);
    return response.data;
  } catch (error) {
    console.error(`Error disliking person with ID ${id}:`, error);
    throw error;
  }
};

export const getLikedPeople = async () => {
  try {
    const response = await api.get(`/people/liked`);
    return response.data;
  } catch (error) {
    console.error('Error fetching liked people:', error);
    throw error;
  }
};

export default api;
