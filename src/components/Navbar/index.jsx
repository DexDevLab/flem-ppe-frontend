/**
 * Componente da composição da Navbar.
 *  @module Navbar
 */

import {
  Avatar,
  Box,
  Divider,
  Flex,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  SimpleGrid,
  Spinner,
  Text,
  useControllableState,
} from "@chakra-ui/react";

import { FiChevronDown, FiLogOut, FiMenu } from "react-icons/fi";
import { EntitiesChange } from "components/Navbar/EntitiesChange";
import { useRouter } from "next/router";
import { Component, useEffect } from "react";
import { Logo } from "components/Logo";
import { EditIcon } from "@chakra-ui/icons";
import { IconBox } from "components/Icons/IconBox";
import { useSession, signOut } from "next-auth/react";

/**
 * Monta a Navbar.
 * @method Navbar
 * @memberof module:Navbar
 * @param {Object} appName nome de exibição na Navbar
 * @param {Object} entities valor da "entity", que define a
 * localização do projeto (BA ou TO)
 * @param {Object} onclick definição de ação após o clique
 * @param {Component} children estruturas filho da composição
 * @returns {Component} componente estilizado.
 *
 */
export function Navbar({
  appName = "[App Name]",
  entities,
  onClick,
  children,
  ...props
}) {
  const router = useRouter();
  const linkPath = router.asPath.split("/");
  linkPath.shift();
  const [defaultPath] = linkPath;

  const [value, setValue] = useControllableState({
    defaultValue:
      (Array.isArray(entities) &&
        entities.find((entity) => entity.value === defaultPath)?.value) ||
      "",
  });
  const { data: session } = useSession();

  const [icon, setIcon] = useControllableState({ defaultValue: <FiLogOut /> });
  const signOutSession = () => {
    setIcon(<Icon as={Spinner} color="black" mt={1} />);
    signOut();
  };

  useEffect(() => {
    if (defaultPath !== value) {
      router.push(`/${value}`);
    }
  }, [value]);
  return (
    <Box
      position="sticky"
      top="0"
      p={1}
      shadow="lg"
      sx={{ backdropFilter: "blur(10px)" }}
      zIndex={10}
    >
      <Flex flexDir="column" justifyContent="center">
        <SimpleGrid columns={2} w="100%">
          <GridItem display="flex" alignItems="center">
            <IconButton
              bg="none"
              _hover={{ background: "none" }}
              _focus={{ background: "none" }}
              fontSize="2xl"
              icon={<FiMenu />}
              onClick={onClick}
              me={0.5}
            />
            <Heading
              as="h3"
              fontSize={["sm", "2xl"]}
              onClick={onClick}
              cursor="pointer"
            >
              {appName}
            </Heading>
            {entities && (
              <EntitiesChange
                options={entities}
                value={value}
                setValue={setValue}
                title="Localidade"
                ms={2}
                variant="outline"
              />
            )}
          </GridItem>
          <GridItem
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Logo alt="logo_flem" me={[0, 1]} h={[4, 30]} />
            <Divider
              orientation="vertical"
              mx={[2, 4]}
              borderColor="gray.500"
            />
            <Menu autoSelect={false}>
              <MenuButton>
                <Flex alignItems="center">
                  <Flex
                    flexDir="column"
                    alignItems="flex-end"
                    mr={4}
                    display={["none", "flex"]}
                  >
                    <Heading as="h3" size="sm">
                      {session ? session.user.name : "Development"}
                    </Heading>
                    {/* <Text color="brand1">Admin</Text> */}
                  </Flex>
                  <Avatar size="md" mr={1} />
                  {session && <FiChevronDown />}
                </Flex>
              </MenuButton>
              <MenuList hidden={!session}>
                <MenuGroup title="Opções">
                  {/* <MenuItem>My Account</MenuItem> */}
                  <MenuItem
                    icon={icon}
                    closeOnSelect={false}
                    onClick={signOutSession}
                  >
                    Sair
                  </MenuItem>
                </MenuGroup>
                {/* <MenuDivider />
                <MenuGroup title="Help">
                  <MenuItem>Docs</MenuItem>
                  <MenuItem>FAQ</MenuItem>
                </MenuGroup> */}
              </MenuList>
            </Menu>
          </GridItem>
        </SimpleGrid>
      </Flex>
      {children && (
        <>
          <Divider my={1} />
          <Flex px={1} alignItems="baseline">
            {children}
          </Flex>
        </>
      )}
    </Box>
  );
}
