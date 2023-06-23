import { Box, Collapse, Flex, Link, MenuItem, Text } from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { useRouter } from "next/router";

/**
 * Monta o subitem de um Sidebar Item.
 * @method SidebarSubItem
 * @memberof module:Sidebar
 * @param {Object} icon ícone do subitem
 * @param {Object} title texto do subitem
 * @param {Object} href caminho referente ao subitem
 * @param {Object} sidebarClose função ao fechar o subitem
 * @param {Object} children componentes filho do objeto
 * @param {Object} isOpen função ao executar quando o subitem
 * estiver em exibição
 * @param {Object} onToggle função ao executar quando é feito
 * "toggle"
 * @returns {Component} componente estilizado.
 *
 */
export function SidebarSubItem({
  icon,
  title,
  href,
  sidebarClose,
  children,
  isOpen,
  onToggle,
}) {
  const router = useRouter();
  const active = router.asPath === `${href}`;
  const handleClick = (e) => {
    e.preventDefault();
    if (href) {
      router.push(href);
      return sidebarClose();
    }
    return children && onToggle();
  };

  return (
    <Box w="100%" borderBottomRadius={10}>
      <Collapse in={isOpen} animateOpacity>
        <MenuItem p={0} _focus={{ bg: "none" }}>
          <Link
            role="group"
            _hover={{ bg: "brand1.500", color: "white", shadow: "lg" }}
            w="100%"
            rounded="md"
            bg={active ? "brand1.500" : ""}
            onClick={handleClick}
          >
            <Flex py={1} ms={7} rounded="md">
              <IconBox
                _groupHover={{
                  color: "white",
                }}
                color={active ? "white" : "brand1.400"}
                h="30px"
                w="30px"
                fontSize="xl"
              >
                {icon}
              </IconBox>
              <Text
                ml={2}
                fontWeight="bold"
                fontSize="sm"
                color={active ? "white" : "brand1.400"}
                _groupHover={{ color: "white" }}
                my="auto"
              >
                {title}
              </Text>
            </Flex>
          </Link>
        </MenuItem>
      </Collapse>
    </Box>
  );
}
