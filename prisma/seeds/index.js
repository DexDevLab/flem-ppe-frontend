const { formacoesSeed } = require("./formacoes");
const { etniaSeed } = require("./etnia");
const { tamanhoUniformeSeed } = require("./tamanhoUniforme");
const { pendenciasTiposSeed } = require("./pendenciasTipos");
const { tipoHistoricoSeed } = require("./historicoTipo");
const { demandantesSeed } = require("./demandantes");
const { municSeed } = require("./municipios");
const { situacoesVagaSeed } = require("./situacoesVaga");

module.exports = {
  tamanhoUniformeSeed,
  etniaSeed,
  formacoesSeed,
  pendenciasTiposSeed,
  tipoHistoricoSeed,
  demandantesSeed,
  municSeed,
  situacoesVagaSeed
};
