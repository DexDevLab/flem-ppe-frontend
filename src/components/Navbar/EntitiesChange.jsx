import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useBreakpointValue,
} from "@chakra-ui/react";

/**
 * Realiza a mudança de entity (localidade) e transfere o valor como propriedade
 * em um objeto componentizado.
 * @method EntitiesChange
 * @memberof module:Navbar
 * @param {Object} options lista de entidades
 * @param {Object} value valor da "entity", que define a
 * localização do projeto (BA ou TO)
 * @param {Function} setValue função para definir o valor
 * @param {Object} title título da entidade (definido "localidade" como padrão)
 * @returns {Component} componente de seleção de entidade e de mudança de entidade
 *
 */
export function EntitiesChange({
  options = null,
  value = null,
  setValue = null,
  title = null,
  ...props
}) {
  const size = useBreakpointValue({ base: "xs", sm: "xs", md: "md" });
  return (
    <>
      {Array.isArray(options) && (
        <Menu closeOnSelect={true}>
          <MenuButton as={Button} colorScheme="brand1" size={size} {...props}>
            {(Array.isArray(options) &&
              options.find((option) => option.value === value)?.label) ||
              "Selecione..."}
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup defaultValue={value} title={title} type="radio">
              {Array.isArray(options) &&
                options.map((option) => (
                  <MenuItemOption
                    value={option.value}
                    onClick={(e) => setValue(e.currentTarget.value)}
                    key={`entity[${option.value}]`}
                  >
                    {option.label}
                  </MenuItemOption>
                ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
