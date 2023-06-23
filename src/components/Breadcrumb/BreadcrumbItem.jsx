import { Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";

/**
 * Item de Breadcrumb. Cria o componente de item conforme a navegação e o aplica
 * baseando-se no caminho da rota.
 * @method BreadcrumbItem
 * @memberof module:Breadcrumb
 * @param {Component} children o componente-filho que representa o caminho do Breadcrumb,
 * ou o ícone base do Breadcrumb
 * @param {Object} icon o ícone inicial do breadcrumb
 * @param {Object} href o caminho da rota
 * @param {Object} isCurrentPage repassa o tema de cor dependendo da página a ser carregada
 *
 * @returns {Component} componente de Breadcrumb com o nome do caminho devidamente convertido e
 * estilizado.
 */
export const BreadcrumbItem = ({
  children,
  icon,
  href,
  isCurrentPage,
  ...props
}) => {
  return (
    <NextLink href={href} passHref>
      <Link
        fontWeight="medium"
        fontSize="sm"
        color={isCurrentPage ? "brand1.700" : "brand1.500"}
        {...props}
        textTransform="capitalize"
      >
        {icon ? <Icon as={icon} pt={"5px"} boxSize={5} /> : children}
      </Link>
    </NextLink>
  );
};
