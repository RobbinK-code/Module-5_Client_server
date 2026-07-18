import client from "./client";

export const listGenres = () => client.get("/genres");

export const createGenre = (payload) => client.post("/genres", payload);
