const FormatHour = (time) => {
  const date = new Date(time);
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  return (
    <p>
      {hour}:{String(minute).padStart(2, "0")}
    </p>
  );
};

export default FormatHour;
