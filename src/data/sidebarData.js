import {
  FiArchive,
  FiCalendar,
  FiFileText,
  FiHome,
  FiList,
  FiMapPin,
  FiPackage,
  FiUsers,
} from "react-icons/fi";
import {
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  TbBrandTelegram,
  TbBuildingCommunity,
  TbPerspective,
} from "react-icons/tb";
import { MdWorkOutline } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";

export const sidebarData = [
  {
    items: [
      {
        title: "Dashboard",
        icon: FiHome,
        href: "/dashboard",
      },
    ],
  },
  {
    label: "cadastros",
    items: [
      {
        title: "Beneficiários",
        icon: FiUsers,
        href: "/beneficiarios",
      },
      {
        title: "Demandantes",
        icon: TbBuildingCommunity,
        href: "/demandantes",
      },
      // {
      //   title: "Cadastros",
      //   icon: FiArchive,
      //   href: "/cadastros",
      //   subItems: [
      //     {
      //       title: "Beneficiários",
      //       icon: FiUserPlus,
      //       href: "/beneficiarios"
      //     },
      //   ]
      // },
      {
        title: "Unidades de Lotação",
        icon: FiMapPin,
        href: "/unidade-lotacao",
      },
      {
        title: "Escritórios Regionais",
        icon: HiOutlineOfficeBuilding,
        href: "/escritorios-regionais",
      },
      // {
      //   title: "Monitores",
      //   icon: HiOutlineUserGroup,
      //   href: "/monitores",
      // },
      {
        title: "Materiais",
        icon: FiPackage,
        href: "/materiais",
      },
      {
        title: "Tipos de Histórico",
        icon: FiList,
        href: "/tipo-historico",
      },
      {
        title: "Formações",
        icon: HiOutlineAcademicCap,
        href: "/formacoes",
      },
      {
        title: "Templates de Ofícios",
        icon: FiFileText,
        href: "/templates-oficios",
      },
      {
        title: "Situações de Vaga",
        icon: MdWorkOutline,
        href: "/situacoes-vaga",
      },
      {
        title: "Eventos",
        icon: FiCalendar,
        href: "/eventos",
      },
      {
        title: "Colaboradores CR",
        icon: FiUsers,
        href: "/colaboradores-cr",
      },
      {
        title: "Ações CR",
        icon: FiCalendar,
        href: "/acoes",
      },
    ],
  },
  {
    label: "gerenciamento",
    items: [
      // {
      //   title: "Cadastros",
      //   icon: FiArchive,
      //   href: "/cadastros",
      //   subItems: [
      //     {
      //       title: "Beneficiários",
      //       icon: FiUserPlus,
      //       href: "/beneficiarios"
      //     },
      //   ]
      // },
      {
        title: "Comunicados",
        icon: TbBrandTelegram,
        href: "/comunicados",
      },
      {
        title: "Envio de Ofícios",
        icon: FiFileText,
        href: "/envio-oficios",
      },
      {
        title: "Fila de Ações CR",
        icon: FiCalendar,
        href: "/fila-acoes",
      },
    ],
  },
];
