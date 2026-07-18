import client from "./client";

export const getWatchlist = () => client.get("/watchlist");

export const addToWatchlist = (anime_id, status = "plan_to_watch") =>
  client.post("/watchlist", { anime_id, status });

export const updateWatchlistItem = (itemId, payload) =>
  client.put(`/watchlist/${itemId}`, payload);

export const removeFromWatchlist = (itemId) =>
  client.delete(`/watchlist/${itemId}`);
