import { Heading, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";

export default function Cadastro({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;

  const session = useSession();
  console.log(session);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <Heading size="lg">Parâmetros de Ofícios</Heading>
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

Cadastro.auth = false;
Cadastro.dashboard = true;
