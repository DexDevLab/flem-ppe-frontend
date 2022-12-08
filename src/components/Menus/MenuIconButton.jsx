import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiMoreHorizontal, FiUnlock } from "react-icons/fi";

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
                {menuGroup.menuGroupButtons.map((menuButton, idx) => (
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
