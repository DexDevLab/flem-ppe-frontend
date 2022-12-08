/**
 * Provedor de Autenticação.
 * @module api
 */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { authUser, getUserGroups, getUserInfo } from "services/auth/index";
import { authUserQa } from "services/auth/index";
/**
 * Classe de Autenticação.
 */
export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "flemCredentials",
      name: "Credentials Authentication",
      credentials: {
        username: { label: "User", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      type: "credentials",
      async authorize(credentials, req) {
        try {
          const user = await authUserQa(
            credentials.username,
            credentials.password
          );
          if (user) return user;

          return null;
        } catch (error) {
          return false;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  jwt: {
    encryption: true,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.idUser;
        token.username = user.username;
        token.name = user.name;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          username: token.username,
          name: token.name,
          // ...token.ldap.user,
          // roles: { ...token.ldap.userGroups },
        },
      };
    },
    redirect: async ({ baseUrl }) => {
      return baseUrl;
    },
  },
  debug: true,
});
