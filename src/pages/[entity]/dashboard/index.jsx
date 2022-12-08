/**
 * Página de Dashboard
 * @module dashboard
 */

import {
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { Card } from "components/Cards";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { axios, getBackendRoute } from "services";

/**
 * Renderiza a Página de Dashboard.
 * @method Dashboard
 * @memberof module:dashboard
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function Dashboard({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const [benefAtivos, setBenefAtivos] = useState([]);
  const router = useRouter();
  const { asPath } = router;
  const [getheringData, setGetheringData] = useBoolean(true);
  const session = useSession();

  const getBenefQtd = useCallback(async () => {
    setGetheringData.on();
    try {
      const queryConfig = {
        // filter: { nome: { contains: "a" } },
        select: {
          id: true,
        },
      };
      // const { data: ativos } = await axios.patch(
      //   `/api/${entity}/beneficiarios`,
      //   queryConfig
      // );
      const { data: ativos } = await axios.patch(
        getBackendRoute(entity, "beneficiarios"),
        queryConfig
      );
      setBenefAtivos(ativos);
    } catch (error) {
      console.log(error);
    } finally {
      setGetheringData.off();
    }
  }, []);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    getBenefQtd();
  }, []);

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <SimpleGrid columns={[1, 2, 2, 4]} spacing={6} pb={0} mb={8}>
        <Card
          icon={FiUsers}
          label="Beneficiários Ativos"
          value={benefAtivos.length.toString()}
          isLoading={getheringData}
        />
        <Card
          icon={FiUsers}
          label="Total Beneficiários"
          value={benefAtivos.length.toString()}
          isLoading={getheringData}
        />
        {/* <Card icon={FiCalendar} />
        <Card icon={FiCalendar} /> */}
      </SimpleGrid>
      <Spacer />
      <SimpleGrid columns={1} spacing={6} pb={0}>
        <Flex h={["", "", "400px"]}>
          {/* <LineChart /> */}
          <Heading size="md">Dashboard em desenvolvimento...</Heading>
        </Flex>
      </SimpleGrid>
    </AnimatePresenceWrapper>
  );
}
export async function getServerSideProps(context) {
  const {
    params: { entity },
  } = context;
  const entities = ["ba", "to", "rj"];
  // const posts = await api.getContentList({
  //   referenceName: "posts",
  //   languageCode: "en-us"
  // });
  // const page = posts.items.find((post) => {
  //   return post.fields.slug === ctx.params.slug.join("/");
  // });

  const entityCheck = entities.find((ent) => ent === entity || undefined);

  return {
    props: {
      entity: entityCheck || null,
    },
  };
}

Dashboard.auth = true;
Dashboard.dashboard = true;
