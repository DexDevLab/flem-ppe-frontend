/**
 *  Componentes de Notificação
 *  @module Toast
 */

import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";

/**
 * Componente de notificação tipo Toast
 * @method Toast
 * @memberof module:Toast
 * @returns {Component} componente estilizado
 */
export const Toast = () => {
  return (
    <Flex
      bg="blue.600"
      ps={4}
      py={3}
      pe={8}
      color="white"
      rounded="md"
      boxShadow="xl"
    >
      <Icon as={FiInfo} me={2} boxSize={6} />
      <Box>
        <Heading size="sm" flex="1 1 0%" mb={1}>
          {" "}
          Falha na autenticação{" "}
        </Heading>
        <Text size="sm" flex="1 1 0%">
          {" "}
          Usuário e/ou senha inválidos{" "}
        </Text>
      </Box>
    </Flex>
  );
};
