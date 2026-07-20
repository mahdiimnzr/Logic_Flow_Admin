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
  return axios.post(
    "https://image-generator.mahdi7813nazarzadeh-c44.workers.dev/",
    data,
    {
      responseType: "blob",
    },
  );
};
