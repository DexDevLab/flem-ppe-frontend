/**
 * Inicialização da aplicação.
 */

import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { SessionProvider, useSession } from "next-auth/react";
import { Global, css } from "@emotion/react";
import Head from "next/head";
import theme from "styles/theme";
import { DashboardLayout } from "components/Layout/DashboardLayout";
import "styles/editor.css";
import "styles/pagePrint.css";
import { useRouter } from "next/router";

/**
 * Aplica estilo global sobre as páginas.
 * @param {Component}
 * @returns
 */
const GlobalStyle = ({ children }) => (
  <>
    <Head>
      <meta content="width=device-width,initial-scale=1" name="viewport" />
    </Head>
    <CSSReset />
    <Global
      styles={css`
        html {
          scroll-behavior: smooth;
        }
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}
    />
    {children}
  </>
);

const appName = "Portal PPE";

/**
 * Função de Caller da aplicação.
 * @method MyApp
 * @param {Object} session componente de sessão de login
 * @returns Renderização da página e da aplicação
 */
function MyApp({ Component, pageProps: { session, ...pageProps }, router }) {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyle />
      <SessionProvider session={session}>
        {Component.auth && (
          <Auth>
            {Component.dashboard ? (
              <DashboardLayout appName={appName} {...pageProps}>
                <Component {...pageProps} />
              </DashboardLayout>
            ) : (
              <Component {...pageProps} />
            )}
          </Auth>
        )}
        {!Component.auth && Component.dashboard && (
          <DashboardLayout appName={appName} {...pageProps} {...pageProps}>
            <Component {...pageProps} />
          </DashboardLayout>
        )}
        {!Component.auth && !Component.dashboard && (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </ChakraProvider>
  );
}

function Auth({ children }) {
  const env = process.env.NODE_ENV;
  const { data: session, status } = useSession({ required: env  === "production" });
  const isUser = !!session?.user;
  
  if (isUser || env  === "development") {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div></div>;
}

export default MyApp;
