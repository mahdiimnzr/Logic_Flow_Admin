import axios from "axios";

export const getDescribe = async (messages) => {
  const response = await axios.post(
    "https://describe.mahdi7813nazarzadeh-c44.workers.dev/",
    {
      messages,
    },
  );

  return response;
};

export const generateImage = async (data) => {
  const response = axios.post(
    "https://image-generator.mahdi7813nazarzadeh-c44.workers.dev/",
    data,
    {
      responseType: "blob",
    },
  );

  return response;
};

export const getCourseRecommended = async (messages) => {
  const response = await axios.post(
    "https://hidden-unit-ba14.mahdi7813nazarzadeh-c44.workers.dev",
    {
      messages,
    },
  );

  return response;
};
