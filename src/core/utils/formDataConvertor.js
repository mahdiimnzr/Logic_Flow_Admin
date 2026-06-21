const formDataConverter = (object) => {
  const array = Object.keys(object);
  const formData = new FormData();
  array.map((key) => formData.append(key, object[key]));
  return formData;
};

export default formDataConverter;
