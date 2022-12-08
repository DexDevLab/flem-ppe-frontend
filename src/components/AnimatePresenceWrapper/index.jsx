/**
 * Animação de transição entre componentes
 * @module AnimatePresenceWrapper
 */

import { Box, Center, ScaleFade, Spinner } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Component } from "react";
import { variants } from "styles/transitions";

/**
 * Animação de transição de componente.
 * @method AnimatePresenceWrapper
 * @memberof module:AnimatePresenceWrapper
 * @param {Component} children componente-filho da animação
 * @param {Object} isLoaded define estado de transição da animação. Se o
 * componente já estiver renderizado, ele encerra a animação
 * @returns componente com animação dependendo do estado do componente-alvo
 *
 */
export function AnimatePresenceWrapper({ children, isLoaded, router, p = 5 }) {
  return (
    <>
      {!isLoaded ? (
        <>
          <ScaleFade in={!isLoaded} initialScale={0.9} unmountOnExit>
            <Center h="90vh">
              <Spinner
                boxSize={20}
                color="brand1.500"
                thickness="4px"
                speed=".5s"
                emptyColor="gray.200"
              />
            </Center>
          </ScaleFade>
        </>
      ) : (
        <ScaleFade in={isLoaded} initialScale={0.9}>
          <motion.div
            key={router.route}
            initial="pageInitial"
            animate="pageAnimate"
            exit="pageExit"
            variants={variants}
          >
            <Box p={p}>{children}</Box>
          </motion.div>
        </ScaleFade>
      )}
    </>
  );
}
