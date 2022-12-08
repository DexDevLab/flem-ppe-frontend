/**
 * Módulo de Autenticação LDAP.
 * @module LDAPService
 */

import ActiveDirectory from "activedirectory";

const config = {
  url: process.env.NEXT_PUBLIC_LDAP_URI,
  baseDN: process.env.NEXT_PUBLIC_LDAP_BASE_DN,
  username: process.env.NEXT_PUBLIC_LDAP_USERNAME,
  password: process.env.NEXT_PUBLIC_LDAP_PASSWORD,
};

const ad = new ActiveDirectory(config);

/**
 * Função utilizada para realizar a autenticação do usuário via LDAP
 * @method authUser
 * @memberof module:LDAPService
 * @param {string} username Nome de usuário do Active Directory
 * @param {string} password Senha do usuário do Active directory
 * @returns {Promise} Retorna uma Promise que será resolvida caso o usuário e senha estejam corretos, ou rejeitada caso estejam incorretos.
 */
export const authUser = (username, password) =>
  new Promise((resolve, reject) => {
    ad.authenticate(username, password, (err, auth) => {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return reject(err);
      }
      if (auth) {
        console.log("Authenticated!");
        return resolve(auth);
      } else {
        console.log("Authentication failed!");
        return reject("Authentication failed!");
      }
    });
  });

export const getUserInfo = (username) =>
  new Promise((resolve, reject) => {
    ad.findUser(username, (err, user) => {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return reject(err);
      }
      if (user) {
        console.log("User Finded!");
        return resolve(user);
      } else {
        console.log("Find User failed!");
        return reject();
      }
    });
  });

export const getUserGroups = (username) =>
  new Promise((resolve, reject) => {
    ad.getGroupMembershipForUser(username, (err, groups) => {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return reject(err);
      }
      if (groups) {
        console.log("Groups Finded!");
        return resolve(groups);
      } else {
        console.log("Find Groups failed!");
        return reject();
      }
    });
  });
