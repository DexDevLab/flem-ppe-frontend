/**
 * Componente de Icon Box. Alinha e parametriza
 * o ícone da Sidebar para que tenha alinhamento
 * e orientação padronizados.
 *  @module Icons
 */

import { Flex, Icon } from "@chakra-ui/react";

/**
 * Flex contendo parâmetros para alinhamento, bem
 * como uso de ícone com ajustes próprios de fonte.
 * @method IconBox
 * @memberof module:Icons
 * @param {Object} props parâmetros do componente
 * @param {Object} children definições de ícone
 * @param {Object} fontSize tamanho da fonte da label
 * do ícone
 * @returns {Component} componente contendo as propriedades do ícone
 * e de sua respectivas label, passadas como props
 */
export default function IconBox(props) {
  const { children, fontSize, ...rest } = props;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"12px"}
      {...rest}
    >
      <Icon as={children} fontSize={fontSize}></Icon>
    </Flex>
  );
}
