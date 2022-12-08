/**
 * Componentes de Layout.
 *  @module Layout
 */

import { useDisclosure } from "@chakra-ui/react";
import { BreadcrumbBar } from "components/Breadcrumb";
import { Navbar } from "components/Navbar";
import { Sidebar } from "components/Sidebar";
import { SidebarItem } from "components/Sidebar/SidebarItem";
import { SidebarLabel } from "components/Sidebar/SidebarLabel";
import { sidebarData } from "data/sidebarData";
import { useRouter } from "next/router";
import { Fragment } from "react";



 /**
   * Cria um layout padrão de dashboard para a plataforma
   * @method DashboardLayout
   * @memberof module:Layout
   * @param {Object} appName nome do portal
   * @param {Component} children componentes-filho do layout
   * @returns {Component} componente que monta o layout.
   */
export function DashboardLayout({ appName, children, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const entities = [
    { value: "ba", label: "Bahia", defaultValue: true },
    // { value: "to", label: "Tocantins", defaultValue: false },
  ];
  const router = useRouter();
  const linkPath = router.asPath.split("/");
  linkPath.shift();

  return (
    <>
      <Navbar onClick={onOpen} entities={entities} appName={appName}>
        <BreadcrumbBar entities={entities} />
      </Navbar>
      <Sidebar isOpen={isOpen} onClose={onClose} appName={appName}>
        {sidebarData &&
          sidebarData.map((obj, idx) => (
            <Fragment key={`frag_${obj.label}${idx}`}>
              <SidebarLabel key={`SidebarLabel_${obj.label}${idx}`}>
                {obj.label}
              </SidebarLabel>
              {obj.items.map((item, idx) => (
                <SidebarItem
                  key={`SidebarItem_${item.title}_${idx}`}
                  icon={item.icon}
                  title={item.title}
                  href={`${item.href}`}
                  sidebarClose={onClose}
                  subItems={item.subItems}
                />
              ))}
            </Fragment>
          ))}
      </Sidebar>
        {children}
    </>
  );
}
