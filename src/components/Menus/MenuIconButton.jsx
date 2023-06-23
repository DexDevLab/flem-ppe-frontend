/**
 * Componente de objetos de Menu
 *  @module Menus
 */

import {
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import _ from "lodash";

/**
 * Componente de Botão de Menu
 * @method MultipleSelectInput
 * @memberof module:Inputs
 * @param {Object} icon ícone para o Menu
 * @param {Object} menuItems itens listados no Menu
 * @returns {Component} componente de Botão de Menu
 */
export function MenuIconButton({ icon, menuItems, ...props }) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={icon}
        variant="outline"
        {...props}
      />
      {Array.isArray(menuItems) && (
        <MenuList>
          {/* {menuItems &&
            menuItems.map((item) => (
              <MenuItem key={item} icon={item.icon}>
                {item.text}
              </MenuItem>
            ))} */}
          {menuItems &&
            menuItems.map((menuGroup, idx) => (
              <MenuGroup
                key={menuGroup.menuGroupLabel + idx}
                title={menuGroup.menuGroupLabel}
                textAlign="left"
              >
                {menuGroup.menuGroupButtons
                  .filter(
                    (menuButton) =>
                      !_.isEmpty(menuButton) && _.isObject(menuButton)
                  )
                  .map((menuButton, idx) => (
                    <MenuItem
                      key={menuButton.text + idx}
                      onClick={menuButton.onClick}
                      isDisabled={menuButton.disabled}
                      icon={icon}
                      {...menuButton}
                    >
                      {menuButton.text}
                    </MenuItem>
                  ))}
              </MenuGroup>
            ))}
        </MenuList>
      )}
    </Menu>
  );
}
