import axiosClient from "axios";

/**
 * Conexão padrão com o Backend pelo Axios.
 * @method axios
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const axios = axiosClient.create({
  baseURL: process.env.NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND || "/",
  timeout: 30000,
});


/**
 * Conexão com o Backend pelo Axios ignorando o timeout padrão de 30000ms.
 * @method axiosNoTimeout
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const axiosNoTimeout = axiosClient.create({
  baseURL: process.env.NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND || "/",
  timeout: 0,
});


/**
 * Conexão padrão com a API de Arquivos pelo Axios.
 * @method filesAPIService
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const filesAPIService = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});


/**
 * Conexão com a API de Arquivos pelo Axios, utilizada para upload na adição da header correta.
 * @method filesAPIUpload
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const filesAPIUpload = axiosClient.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_FILE_UPLOAD}/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000,
});


/**
 * Conexão padrão com a API de Serviço de Email.
 * @method mailService
 * @memberof module:services
 * @returns {Function} Instância Axios.
 */
export const mailService = axiosClient.create({
  baseURL: `${process.env.NEXT_API_MAIL_SENDER}/api/${process.env.NEXT_PUBLIC_APP_SOURCE}/`,
  timeout: 30000,
});


/**
 * Função para retornar a URL da rota da API do Backend.
 * @method getBackendRoute
 * @memberof module:services
 * @param {String} entity a localidade do Projeto (por exemplo, "ba" para Bahia)
 * @param {String} route rota API
 * @returns {String} URL completa da rota para acesso da API Backend.
 */
export const getBackendRoute = (entity, route) => {
  return `${process.env.NEXT_PUBLIC_API_PPE_BACKEND}/${entity}/${route}`;
};
