import { authDb } from "./authDb";

/**
 * Callback de autenticação em nível QA/beta. Utilizado para
 * fazer uma autenticação fácil e sem implementação direta com
 * Servidor AD (LDAP) ou OAuth. Utiliza um padrão de nomes de
 * usuário e senha listados no arquivo authDb para autenticar.
 * Utilizada apenas em escopo de testes.
 * @param {String} user login de usuário 
 * @param {String} pass senha de usuário
 * @returns {Object} credenciais de usuário e senha no formato
 * user e pass.
 */
export const authUserQa = async (user, pass) => {
  const getUser = authDb.find(
    ({ username, password }) => username === user && password === pass
  );
  if (getUser) {
    return getUser;
  } else {
    return null;
  }
};
