import axiosClient from "axios";

export const axios = axiosClient.create({
  baseURL: process.env.NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND || "/",
  timeout: 30000,
});

export const filesAPIService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});

export const filesAPIUpload = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
});

export const mailService = axiosClient.create({
  baseURL: `${process.env.NEXT_API_MAIL_SENDER}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});

export const getBackendRoute = (entity, route) => {
  return `${process.env.NEXT_PUBLIC_API_PPE_BACKEND}/${entity}/${route}`;
};
