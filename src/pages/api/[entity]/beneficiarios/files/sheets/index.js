import axios from "axios";
//import { benefLookupTeste, benefValidateTeste } from "controllers";
import { DateTime } from "luxon";
// import { maskCPF } from "masks-br";
import nc from "next-connect";
import { allowCors } from "services";
import { filesAPIService, filesAPIUpload } from "services/apiService";
import { phoneNumberFixer } from "utils/phoneNumberFixer";
import { read, utils } from "xlsx";

// Handler do NextConnect. Chama o handler dessa conexão.
const handler = nc({
  onError: (err, req, res, next) => {
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

export default allowCors(handler);

/**
 * Converte um objeto do tipo String de valor UPPERCASE,
 * lowercase ou DiVerSo em um objeto String em camelCase.
 * @param {String} str objeto a ser convertido
 * @returns string em formato camelCase
 */
function camelCase(str) {
  return str
    .replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function (b) {
      return b.toLowerCase();
    });
}

/**
 * Normaliza e formata um objeto dentro de uma sheet, seja coluna ou linha.
 * @param {Object} object "key" a ter seu valor normalizado e formatado
 * @returns objeto formatado
 */
const replaceKeys = (object) => {
  Object.keys(object).forEach(function (key) {
    const newKey = camelCase(
      key
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\//g, "_")
        .replace(/º/g, "_")
    );
    if (object[key] && typeof object[key] === "object") {
      replaceKeys(object[key]);
    }
    if (key !== newKey) {
      object[newKey] = object[key];
      delete object[key];
    }
  });
  return object;
};

//Lista de colunas e valores oriundos da planilha os quais devem ser tratados.
const SHEETS_COLUMNS = [
  //"ano",
  //"territorio",
  "demandante",
  //"modalidade",
  //"tipoDeVinculo",
  "municipioDaVaga",
  "municipioDoAluno",
  "nomeDoColegio",
  //"eixoDeFormacao",
  "cursoDeFormacao",
  "dataDeNascimento",
  "raca_cor",
  //"deficiencia",
  "cpfAluno",
  "sexo",
  "matricula",
  "nome",
  "telefone01",
  "telefone02",
  "dataDaConvocacao",
];

/**
 * Manipulação do handler para receber os dados da planilha (de formato File para formato Object)
 * e preparar adequadamente seus valores para então retornar ao backend após uma série de validações.
 */
handler.get(async (req, res) => {
  try {
    const { fileId, entity } = req.query;
    // LOCALIZAÇÃO DO ARQUIVO TEMPORÁRIO QUE DEVE TER SEUS DADOS LIDOS E MANIPULADOS
    // const filepth = `${process.env.NEXT_UPLOAD_TEMP_DIR}/${filename}`;

    const { data: fileFromApi } = await filesAPIService.get(`/downloadFile`, {
      params: { fileId },
      responseType: "arraybuffer",
    });

    const {
      data: { fileDetails },
    } = await filesAPIService.get(`/getFile`, {
      params: { fileId },
    });

    const workbook = read(fileFromApi, {
      type: "array",
      cellDates: true,
    });

    // INSTANCIA O OBJETO CONTENDO OS DADOS
    const sheet = {};
    // RECEBE E MARCA OS DADOS DA PLANILHA
    workbook.SheetNames.forEach((sheetName) => {
      const rawRows = utils.sheet_to_json(workbook.Sheets[sheetName], {
        raw: true,
        defval: null,
      });

      // FORMATA OS DADOS QUE SÃO AS COLUNAS DA PLANILHA
      rawRows.map((row) => replaceKeys(row));
      const filterColumns = rawRows.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key]) => SHEETS_COLUMNS.includes(key))
        )
      );
      /**
       * AJUSTA OS NÚMEROS DE TELEFONE E REPARA OS FORMATOS, PARA QUE FIQUE ALINHADO
       * CORRETAMENTE COM O VALOR QUE ENTRARÁ NO BD
       *
       * */
      const rows = filterColumns
        .filter((row) => Object.keys(row).length === SHEETS_COLUMNS.length)
        .map((row) => ({
          ...row,
          telefone01: phoneNumberFixer(row.telefone01, "BR"),
          telefone02: phoneNumberFixer(row.telefone02, "BR"),
        }));
      // SE A LINHA NÃO É NULA, A INCLUI DENTRO DO OBJETO DA PLANILHA
      if (rows.length > 0) {
        sheet[sheetName] = rows;
      }
    });
    // RETORNA MENSAGEM DE ERRO CASO AS COLUNAS ESTEJAM INVÁLIDAS
    if (Object.keys(sheet).length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "invalid file columns" });
    }

    console.log(158);
    // PRIMEIRA VALIDAÇÃO - VERIFICA NO BANCO BENEFICIÁRIOS JÁ LISTADOS, MARCA BENEFICIÁRIOS ENCONTRADOS, ATIVOS E INATIVOS
    //const lookup = await benefLookupTeste(entity, sheet);
    console.log(159);
    const lookup = await axios.post(`${process.env.NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND}/${entity}/beneficiarios/files/upload`, sheet)
    
    console.log(lookup);
    // SEGUNDA VALIDAÇÃO - CONFERE CAMPOS SE COMUNICANDO COM API E BD E OS FORMATA
    const output2 = await benefValidateTeste(entity, lookup);
    console.log(166);
    // RETORNO
    return res.status(200).json({ ok: true, fileDetails, output2 });
  } catch (error) {
    // MANIPULAÇÃO DE EXCEÇÃO (NÃO TRATADA)
    return res.status(500).json({
      status: "error",
      message: "FALHA NA EXECUÇÃO.",
      error: error.message,
    });
  }
});

// MANIPULAÇÃO DE EXCEÇÃO (NÃO TRATADA)
handler.patch(async (req, res) => {
  throw new Error("Throws me around! Error can be caught and handled.");
});

//FORÇA O PARSING CORRETO PARA O CORPO DO CONTEÚDO DO UPLOAD
export const config = {
  api: {
    bodyParser: false,
  },
};
