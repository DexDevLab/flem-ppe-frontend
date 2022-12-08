//import { axios } from "services";
import axios from "axios";
import { prisma } from "services/prisma/prismaClient";
import { maskCapitalize, maskCPF } from "utils";

/**
 * Localiza beneficiários por matrícula e por CPF. Caso encontre uma matrícula que coincida com alguma informada
 * dentro do BD, verifica se o nome é o mesmo, a fim de prevenir erros de digitação na planilha de importação.
 * Se a matrícula e o nome forem os mesmos, marca como "item.found".
 * Se não forem os mesmos, marcam com * os campos de nome, matrícula e CPF para que o colaborador valide e
 * verifique se existe alguma informação que foi colocada equivocadamente.
 * Se o status da vaga daquele beneficiário não é "ativo", marca como "item.update".
 * Se o beneficiário da lista na planilha não for encontrado nem pela sua matrícula e nem pelo seu CPF, é marcado
 * como FALSE em "item.found", e marcado como FALSE em "item.update".
 * Valores de CPF nulos são marcados como uma String com 0 de comprimento ("").
 * Valores de Matrícula de Secretaria nulos são mantidos como estão (não são manipulados e nem verificados).
 * @param {Object} entity a entidade do Projeto (Bahia, Tocantins etc). A entidade é provida pela query
 * string da URL da API, em [entity]
 * @param {Object} sheet a planilha pré-formatada, com suas colunas e linhas
 * @returns a planilha já sinalizada com os beneficiários encontrados ativos (que não são cadastrados),
 * não-ativos (que são cadastrados) e beneficiários não encontrados (que devem alimentar o BD). "item.found"
 * indica se foi encontrado no BD, seja por matrícula ou por CPF; "item.update" indica se deve ser atualizado,
 * ou seja, se os dados recebidos na planilha irão sobrescrever a base de dados (exceto nome e matrícula).
 */
export async function benefLookupTeste(entity, sheet) {
  const sheets = Object.values(sheet["Plan1"]);
  const matriculas = [];
  const cpfs = [];
  sheets.forEach((item) => {
    if (item.matricula) {
      matriculas.push(item.matricula.toString());
    }
    if (item.cpfAluno) {
      cpfs.push(maskCPF(item.cpfAluno));
    }
  });
  const urlAPIQuery = `${
    process.env.NEXT_PUBLIC_API_PPE_BD_LEGADO
  }/${entity}/beneficiarios?condition=OR${
    matriculas.length ? `&matriculaSAEB=["${matriculas.join('","')}"]` : ""
  }${cpfs.length ? `&cpf=["${cpfs.join('","')}"]` : ""}`;

  const respQuery = await axios.get(urlAPIQuery);

  return await Promise.all(
    sheets.map(async (item) => {
      respQuery.data.query.forEach((resp) => {
        //PROCURA BENEFICIÁRIO PELA MATRÍCULA DA SECRETARIA
        if (item.matricula) {
          if (entity === "ba") {
            // VERIFICA SE A MATRÍCULA JÁ EXISTE NO BD
            if (resp.matriculaSAEB.localeCompare(item.matricula) === 0) {
              /**
               * VERIFICA SE O NOME DO BENEFICIÁRIO É IGUAL AO QUE CONSTA NO BD.
               * EM CASOS ONDE HOUVE UMA MUDANÇA DE NOME (EX. CASAMENTOS E DIVÓRCIOS),
               * O COLABORADOR DEVE ALTERAR O NOME, INSERINDO O NOME CONSTANTE NO BD
               * (PODE SER FEITO POR CONSULTA NA TELA DE BENEFICIÁRIO) E DEPOIS O NOME
               * DEVE SER ALTERADO VIA CONTATO DA CR
               *  */
              if (
                resp.nome
                  .trim()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ===
                item.nome
                  .trim()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
              ) {
                const situacao = resp.Vaga[0].Situacao.nome;
                if (situacao !== "ATIVO") {
                  item.found = true;
                  item.update = true;
                  item.situacao = situacao;
                }
              } else {
                item.nome = `*${item.nome}`;
                item.matricula = `*${item.matricula}`;
              }
            }
          } else {
            if (resp.matriculaSec.localeCompare(item.matricula) === 0) {
              /**
               * VERIFICA SE O NOME DO BENEFICIÁRIO É IGUAL AO QUE CONSTA NO BD.
               * EM CASOS ONDE HOUVE UMA MUDANÇA DE NOME (EX. CASAMENTOS E DIVÓRCIOS),
               * O COLABORADOR DEVE ALTERAR O NOME, INSERINDO O NOME CONSTANTE NO BD
               * (PODE SER FEITO POR CONSULTA NA TELA DE BENEFICIÁRIO) E DEPOIS O NOME
               * DEVE SER ALTERADO VIA CONTATO DA CR
               *  */
              if (
                resp.nome
                  .trim()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ===
                item.nome
                  .trim()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
              ) {
                const situacao = resp.Vaga[0].Situacao.nome;
                /**
                 * VERIFICA SE A SITUAÇÃO DO BENEFICIÁRIO ENCONTRADO É "ATIVO". SE TIVER
                 * QUALQUER STATUS DIFERENTE DE "ATIVO", O ALGORITMO MARCA PARA ATUALIZAR
                 * O BANCO DE DADOS COM OS VALORES DA PLANILHA
                 */
                if (situacao !== "ATIVO") {
                  item.found = true;
                  item.update = true;
                  item.situacao = situacao;
                }
              } else {
                item.nome = `*${item.nome}`;
                item.matricula = `*${item.matricula}`;
              }
            }
          }
        } else {
          if (entity === "ba") {
            item.matricula = "*";
          }
        }
        if (item.cpfAluno) {
          if (
            maskCPF(JSON.stringify(resp.cpf)).localeCompare(
              maskCPF(JSON.stringify(item.cpfAluno))
            ) === 0
          ) {
            /**
             * VERIFICA SE O NOME DO BENEFICIÁRIO É IGUAL AO QUE CONSTA NO BD.
             * EM CASOS ONDE HOUVE UMA MUDANÇA DE NOME (EX. CASAMENTOS E DIVÓRCIOS),
             * O COLABORADOR DEVE ALTERAR O NOME, INSERINDO O NOME CONSTANTE NO BD
             * (PODE SER FEITO POR CONSULTA NA TELA DE BENEFICIÁRIO) E DEPOIS O NOME
             * DEVE SER ALTERADO VIA CONTATO DA CR
             *  */
            if (
              resp.nome
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase() ===
              item.nome
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            ) {
              const situacao = resp.Vaga[0].Situacao.nome;
              /**
               * VERIFICA SE A SITUAÇÃO DO BENEFICIÁRIO ENCONTRADO É "ATIVO". SE TIVER
               * QUALQUER STATUS DIFERENTE DE "ATIVO", O ALGORITMO MARCA PARA ATUALIZAR
               * O BANCO DE DADOS COM OS VALORES DA PLANILHA
               */
              if (situacao !== "ATIVO") {
                item.found = true;
                item.update = true;
                item.situacao = situacao;
              } else {
                item.found = true;
                item.update = false;
                item.situacao = situacao;
              }
            } else {
              item.nome = `*${item.nome}`;
              item.cpfAluno = `*${item.cpfAluno}`;
            }
          }
        } else {
          item.cpfAluno = "";
        }
        //MARCA COMO FALSE AUTOMATICAMENTE QUEM NÃO FOI VALIDADO PELA PROCURA NO BD
        if (!item.found) {
          item.found = false;
        }
        if (!item.update) {
          item.update = false;
        }
      });
      return { ...item };
    })
  );
}

/**
 * Validador de campos, formatação de datas e nomes e devolução dos dados para o request. Esta função é
 * para testes, e, portanto, consulta a lista de Demandantes e Municípios por API externa, e precisa ser
 * substituído por um BD quando em produção.
 * @param {Object} entity a entidade do Projeto (Bahia, Tocantins etc). A entidade é provida pela query
 * string da URL da API, em [entity]
 * @param {Object} sheet Objeto contendo os dados que haviam na planilha de importação
 * @returns um Objeto com os dados da planilha já devidamente formatados e normalizados.
 */
export async function benefValidateTeste(entity, sheet) {
  try {
    // DEVIDO A ALTERAÇÃO PROPOSTA NA REUNIÃO EM 8/07, A LISTA DE DEMANDANTES E DE MUNICÍPIOS NÃO SERÁ
    // GERADA VIA API EXTERNA. USAR ESSAS OPÇÕES APENAS EM CARÁTER DE TESTE ATÉ A FINALIZAÇÃO DOS ESQUEMAS
    // DE BANCO DE DADOS.
    const listaDemand = await fetchDemandantes(entity);
    const listaMunic = await fetchMunicipios(entity);
    const listaFormacao = await prisma.ba_Formacao
      .findMany({
        select: {
          nome: true,
          eixo: {
            select: {
              nome: true,
            },
          },
        },
      })
      .then((data) =>
        data.map(({ nome, eixo }) => ({ formacao: nome, eixo: eixo.nome }))
      );

    const listaEtnia = await prisma.ba_Etnia.findMany({
      select: {
        etnia: true,
      },
    });

    return await Promise.all(
      sheet.map(async (item) => {
        if (!item.found || item.update) {
          //VERIFICA DEMANDANTE PELA SIGLA OU PELO SEU NOME. DEMANDANTES SEM SIGLA NÃO SÃO ACEITOS.
          for (let i = 0; i < listaDemand.length; i++) {
            const itemSiglaListaDemand = listaDemand[i].sigla;
            const itemDemandListaDemand = listaDemand[i].nome;
            // VERIFICA SE O DEMANDANTE CONTÉM SIGLA
            if (item.demandante.includes("-")) {
              const itemDemand = item.demandante.trim().split("-");
              if (
                itemSiglaListaDemand
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "") ===
                itemDemand[0]
                  .trim()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              ) {
                //SE A SIGLA FOR ENCONTRADA, RETORNA OS VALORES CONFORME FORMATADO NA API
                item.demandante = `${itemSiglaListaDemand} - ${itemDemandListaDemand}`;
                break;
              }
              // VERIFICA SE O NOME DO DEMANDANTE É IGUAL COM O DA API

              if (
                itemDemand[1]
                  .trim()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ===
                itemDemandListaDemand
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
              ) {
                // SE O NOME DO DEMANDANTE FOR IGUAL, RETORNA OS VALORES CONFORME FORMATADO NA API
                item.demandante = `${itemSiglaListaDemand} - ${itemDemandListaDemand}`;
                break;
              }
            }
            // VERIFICA O DEMANDANTE PELO NOME, MESMO SE NÃO CONTÉM SIGLA
            if (
              item.demandante
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase() ===
              itemDemandListaDemand
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            ) {
              // SE O NOME DO DEMANDANTE FOR IGUAL, RETORNA OS VALORES CONFORME FORMATADO NA API
              item.demandante = `${itemSiglaListaDemand} - ${itemDemandListaDemand}`;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaDemand.length - 1) {
              item.demandante = `*${item.demandante}`;
              break;
            }
          }

          // VERIFICA MUNICÍPIO DA VAGA
          for (let i = 0; i < listaMunic.length; i++) {
            const itemListaMunic = listaMunic[i].nome;
            // VERIFICA SE O MUNICÍPIO INFORMADO É IGUAL AO LISTADO NA API
            if (
              itemListaMunic
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase() ===
              item.municipioDaVaga
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            ) {
              //SE SIM, FORMATA CONFORME O DA API
              item.municipioDaVaga = itemListaMunic;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaMunic.length - 1) {
              item.municipioDaVaga = `*${item.municipioDaVaga}`;
              break;
            }
          }

          // VERIFICA MUNICÍPIO DO ALUNO
          for (let i = 0; i < listaMunic.length; i++) {
            const itemListaMunic = listaMunic[i].nome;
            if (
              itemListaMunic
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase() ===
              item.municipioDoAluno
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            ) {
              item.municipioDoAluno = itemListaMunic;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaMunic.length - 1) {
              item.municipioDoAluno = `*${item.municipioDoAluno}`;
              break;
            }
          }

          // VERIFICA O CURSO DE FORMAÇÃO
          for (let i = 0; i < listaFormacao.length; i++) {
            const itemListaFormacao = listaFormacao[i].formacao;
            if (
              item.cursoDeFormacao
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase() ===
              itemListaFormacao
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            ) {
              item.cursoDeFormacao = itemListaFormacao;
              break;
            }
            // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
            if (i === listaFormacao.length - 1) {
              item.cursoDeFormacao = `*${item.cursoDeFormacao}`;
              break;
            }
          }

          // VALIDA E FORMATA ETNIA
          for (let i = 0; i < listaEtnia.length; i++) {
            const itemListaEtnia = listaEtnia[i].etnia;
            // VERIFICA SE A ETNIA INFORMADA NÃO É NULA OU EM BRANCO
            if (item.raca_cor !== "" && item.raca_cor) {
              if (
                item.raca_cor
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ===
                itemListaEtnia
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
              ) {
                //SE A ETNIA FOR IGUAL A INFORMADA PELO BD, APLICA A DO BD
                item.raca_cor = itemListaEtnia;
                break;
              }
              // SE FEZ A VARREDURA SOB TODAS AS OPÇÕES  E AINDA NÃO ENCONTROU, RETORNA COM * PARA ALTERAÇÃO PELO USUÁRIO
              if (i === listaEtnia.length - 1) {
                item.raca_cor = `*${item.raca_cor}`;
                break;
              }
            }
            // SE A ETNIA É NULA OU EM BRANCO, RETORNA COMO "NÃO INFORMADA"
            else {
              item.raca_cor = listaEtnia.find(
                ({ etnia }) => etnia === "Não Informada"
              ).etnia;
              break;
            }
          }

          // FORMATA NOME DA INSTITUIÇÃO
          item.nomeDoColegio = maskCapitalize(item.nomeDoColegio);

          //FORMATA SEXO
          item.sexo = maskCapitalize(item.sexo);

          //FORMATA NOME
          item.nome = maskCapitalize(item.nome);
        }

        // TESTE - PARA MOSTRAR APENAS OS BENEFICIÁRIOS QUE NÃO FORAM ENCONTRADOS NO BANCO DE DADOS
        // if (!item.found) {
        //   return item;
        // } else return item.found;

        return item;
      })
    );
  } catch (err) {
    console.log(err);
  }
}

const fetchMunicipios = () => {
  return prisma.ba_Municipios.findMany();
};
const fetchDemandantes = () => {
  return prisma.ba_Demandantes.findMany();
};
