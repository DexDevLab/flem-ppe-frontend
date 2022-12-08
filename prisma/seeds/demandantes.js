const axios = require("axios");

const demandantesSeed = async (prisma) => {
  const { data: demandantes } = await axios.get(
    `http://servicos.ba.gov.br/api/secretarias`
  );
  try {
    return prisma.$transaction([
      prisma.ba_Demandantes.deleteMany(),

      prisma.ba_Demandantes.createMany({
        data: demandantes.map(({ sigla, nome }) => ({ nome, sigla })),
      }),
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { demandantesSeed };
