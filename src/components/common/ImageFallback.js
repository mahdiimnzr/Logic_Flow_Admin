const ImageFallback = ({ src, fallback, ...rest }) => {
  const imageSrc = !src || src.trim() === "" ? fallback : src;
  const handleError = (e) => {
    e.target.src = fallback;
  };
  return <img src={imageSrc} onError={handleError} {...rest} />;
};

export default ImageFallback;
