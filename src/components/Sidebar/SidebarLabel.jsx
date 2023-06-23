import { Heading } from "@chakra-ui/react";

/**
 * Label de Sidebar.
 * @method SidebarLabel
 * @memberof module:Sidebar
 * @param {Object} children componente-filho da label
 * @returns {Component} componente de label customizada para sidebar
 *
 */
export function SidebarLabel({ children, ...props }) {
  return (
    <Heading
      as="h3"
      size="xs"
      color="brand1.600"
      textTransform="uppercase"
      py={2}
      {...props}
    >
      {children}
    </Heading>
  );
}
