export default function RatingStamp({ value, size }) {
  const hasValue = value !== null && value !== undefined;
  return (
    <span
      className={`rating-stamp ${size === "small" ? "small" : ""} ${!hasValue ? "empty" : ""}`}
      title={hasValue ? `${value} out of 10` : "No ratings yet"}
    >
      {hasValue ? value : "—"}
    </span>
  );
}
