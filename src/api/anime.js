import client from "./client";

export const listAnime = (params = {}) => client.get("/anime", { params });

export const getAnime = (id) => client.get(`/anime/${id}`);

export const createAnime = (payload) => client.post("/anime", payload);

export const updateAnime = (id, payload) => client.put(`/anime/${id}`, payload);

export const deleteAnime = (id) => client.delete(`/anime/${id}`);
