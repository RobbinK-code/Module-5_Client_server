import client from "./client";

export const listReviewsForAnime = (animeId) =>
  client.get(`/anime/${animeId}/reviews`);

export const createReview = (animeId, payload) =>
  client.post(`/anime/${animeId}/reviews`, payload);

export const updateReview = (reviewId, payload) =>
  client.put(`/reviews/${reviewId}`, payload);

export const deleteReview = (reviewId) => client.delete(`/reviews/${reviewId}`);
