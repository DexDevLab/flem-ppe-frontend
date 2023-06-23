import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";

/**
 * Monta um componente de filtro para a tabela.
 * @method FilterInput
 * @memberof module:Table
 * @param {Object} children propriedades filho do componente
 * @param {Function} cleanFilter função para executar a limpeza do filtro
 * @param {Object} filterTitle cria o título do filtro dependendo do objeto
 * de pesquisa
 * @param {Object} onChange função ou objeto pela mudança realizada no filtro
 * @param {Object} placeholder placeholder do filtro
 * @param {Object} value  valor de pesquisa do filtro
 * @returns {Component} componente de filtro
 */
export function FilterInput({
  children,
  cleanFilter,
  filterTitle,
  onChange,
  placeholder,
  value,
  ...props
}) {
  return (
    <>
      <Popover trigger="hover" autoFocus={false}>
        {({ isOpen, onClose }) => (
          <>
            <PopoverTrigger>
              <Flex cursor="pointer" alignItems="center">
                {children}
                <Icon
                  as={FiFilter}
                  boxSize={3}
                  ms={1}
                  color={!isOpen && !value && "transparent"}
                  fill={value && "currentColor"}
                />
              </Flex>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Filtrar por {filterTitle} </PopoverHeader>
              <PopoverBody>
                <Input
                  onChange={onChange}
                  placeholder={placeholder}
                  value={value}
                />
              </PopoverBody>
              <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={cleanFilter}
                    disabled={!value}
                    _focus={{
                      boxShadow: "0 0 0 3px var(--chakra-colors-red-300)",
                    }}
                  >
                    Limpar
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </>
        )}
      </Popover>
    </>
  );
}
