/**
 * Página de Dashboard
 * @module dashboard
 */

import {
  Box,
  Collapse,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { Card } from "components/Cards";
import { BarChart, PieChart } from "components/Charts";
import _ from "lodash";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { axios, getBackendRoute } from "services/apiService";
import { dynamicSort } from "utils/dynamicSort";
import { exceptionHandler } from "utils/exceptionHandler";
import { calcularPeriodoMonitoramentoRealizado } from "utils/monitoramento";

/**
 * Renderiza a Página de Dashboard.
 * @method Dashboard
 * @memberof module:dashboard
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function Dashboard({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const [benefGraphData, setBenefGraphData] = useState(null);
  const [benefContrVsDeslGraphData, setBenefContrVsDeslGraphData] =
    useState(null);
  const [benefContrVsDeslTrimGraphData, setBenefContrVsDeslTrimGraphData] =
    useState(null);
  const [benefPorRemessaPorTrimestre, setBenefPorRemessaPorTrimestre] =
    useState(null);
  const [benefAcolhimPorTrimestre, setBenefAcolhimPorTrimestre] =
    useState(null);
  const [monitRealizados, setMonitRealizados] = useState([]);
  const [monitDashboardData, setMonitDashboardData] = useState(null);
  const [inputDateSelectContrDeslChart, setInputDateSelectContrDeslChart] =
    useState(DateTime.now().toFormat("yyyy-MM"));
  const [trimestreSelecionado, setTrimestreSelecionado] = useState(null);
  const router = useRouter();
  const { asPath } = router;
  const [getheringData, setGetheringData] = useBoolean(true);
  const session = useSession();
  const toast = useToast();

  const getDashboardData = useCallback(async () => {
    setGetheringData.on();
    try {
      const queryParamsBeneficiarios = {
        transactionParams: [
          {
            beneficiariosAtivos: {
              queryMode: "count",
              where: {
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosTotal: {
              queryMode: "count",
              where: {},
            },
          },
          {
            beneficiariosAContratar: {
              queryMode: "count",
              where: {
                vaga: {
                  every: {
                    situacaoVaga: {
                      tipoSituacao: { nome: "A Contratar" },
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosDesistentes: {
              queryMode: "count",
              where: {
                vaga: {
                  every: {
                    situacaoVaga: {
                      tipoSituacao: { nome: "Desistente" },
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosPendentes: {
              queryMode: "count",
              where: {
                vaga: {
                  every: {
                    situacaoVaga: {
                      tipoSituacao: { nome: "Pendente" },
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosTransferidos: {
              queryMode: "count",
              where: {
                vaga: {
                  every: {
                    situacaoVaga: {
                      tipoSituacao: { nome: "Transferido" },
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosMasc: {
              queryMode: "count",
              where: {
                sexo: "Masculino",
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosFem: {
              queryMode: "count",
              where: {
                sexo: "Feminino",
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosEtnNA: {
              queryMode: "count",
              where: {
                etnia: {
                  etnia: "Não Informada",
                },
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosEtnAm: {
              queryMode: "count",
              where: {
                etnia: {
                  etnia: "Amarela",
                },
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosEtnBr: {
              queryMode: "count",
              where: {
                etnia: {
                  etnia: "Branca",
                },
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosEtnIn: {
              queryMode: "count",
              where: {
                etnia: {
                  etnia: "Indígena",
                },
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosEtnPa: {
              queryMode: "count",
              where: {
                etnia: {
                  etnia: "Parda",
                },
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosEtnPr: {
              queryMode: "count",
              where: {
                etnia: {
                  etnia: "Preta",
                },
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
            },
          },
          {
            beneficiariosContratadosDataNasc: {
              queryMode: "findMany",
              where: {
                vaga: {
                  every: {
                    situacaoVaga: {
                      nome: "Ativo",
                    },
                  },
                },
              },
              select: {
                dataNasc: true,
              },
            },
          },
          {
            beneficiariosContratadosPorMes: {
              queryMode: "groupBy",
              by: ["dataInicioAtividade"],
              where: {
                vaga: {
                  some: {
                    situacaoVaga_Id: {
                      not: null,
                    },
                  },
                },
                dataInicioAtividade: {
                  not: null,
                },
              },
              _count: true,
            },
          },
        ],
      };

      const queryParamsFormacoes = {
        transactionParams: [
          {
            beneficiariosContratadosPorFormacao: {
              queryMode: "findMany",
              select: {
                nome: true,
                beneficiarios: {
                  select: {
                    id: true,
                  },
                  where: {
                    vaga: {
                      every: {
                        situacaoVaga: {
                          nome: "Ativo",
                        },
                      },
                    },
                  },
                },
              },
              // orderBy: {
              //   beneficiarios: {
              //     _count: "desc",
              //   },
              // },
            },
          },
        ],
      };

      const queryParamsTerrIdent = {
        transactionParams: [
          {
            benefAtivosPorTerrIdent: {
              queryMode: "findMany",
              where: {
                municipios: {
                  some: {
                    vagas: {
                      some: {
                        situacaoVaga: {
                          nome: "Ativo",
                        },
                      },
                    },
                  },
                },
              },
              select: {
                nome: true,
                municipios: {
                  select: {
                    nome: true,
                    vagas: {
                      where: {
                        situacaoVaga: {
                          nome: "Ativo",
                        },
                      },
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };

      // const { data: responseBeneficiarios } = await axios.get(
      //   `/api/${entity}/beneficiarios/dashboard`,
      //   {
      //     params: queryParamsBeneficiarios,
      //   }
      // );

      const { data: responseBeneficiarios } = await axios.get(
        getBackendRoute(entity, "beneficiarios/dashboard"),
        {
          params: queryParamsBeneficiarios,
        }
      );

      //console.log(396, JSON.stringify(responseBeneficiarios))

      // const { data: responseFormacoes } = await axios.get(
      //   `/api/${entity}/formacoes/dashboard`,
      //   {
      //     params: queryParamsFormacoes,
      //   }
      // );

      const { data: responseFormacoes } = await axios.get(
        getBackendRoute(entity, "formacoes/dashboard"),
        {
          params: queryParamsFormacoes,
        }
      );

      //console.log(410, JSON.stringify(responseFormacoes))

      // const { data: monitRealizados } = await axios.get(
      //   `/api/${entity}/monitoramento/dashboard`
      // );

      const { data: networkTime } = await axios.get(
        getBackendRoute(entity, "ext/time-ntp")
      );

      const periodosMonitoramentos = calcularPeriodoMonitoramentoRealizado(
        networkTime.toString()
      );

      const periodoMonitoramentoAtual = periodosMonitoramentos.find(
        ({ startDate, endDate }) =>
          startDate.toString() <= networkTime &&
          endDate.toString() >= networkTime
      );

      const { data: monitRealizados } = await axios.get(
        getBackendRoute(entity, "monitoramentos/dashboard"),
        {
          params: {
            periodoMonitoramento: periodoMonitoramentoAtual,
          },
        }
      );

      //console.log(418, JSON.stringify(monitRealizados))

      // const { data: responseTerrIdent } = await axios.get(
      //   `/api/${entity}/territoriosIdentidade/dashboard`,
      //   { params: queryParamsTerrIdent }
      // );

      const { data: responseTerrIdent } = await axios.get(
        getBackendRoute(entity, "territorios-identidade/dashboard"),
        { params: queryParamsTerrIdent }
      );

      //console.log(428, JSON.stringify(responseTerrIdent))

      setBenefGraphData({
        ...responseBeneficiarios,
        ...responseFormacoes,
        ...responseTerrIdent,
      });

      // console.log(444, {
      //   ...responseBeneficiarios,
      //   ...responseFormacoes,
      //   ...responseTerrIdent,
      // });

      setMonitRealizados(monitRealizados);
      setGetheringData.off();
    } catch (error) {
      toast(exceptionHandler(error));
    } finally {
      //setGetheringData.off();
    }
  }, []);

  const getBenefContrVsDeslChartData = async (rawDateToQuery) => {
    try {
      const dateToQuery = DateTime.fromFormat(rawDateToQuery, "yyyy-MM");
      const queryParamsBeneficiarios = {
        transactionParams: [
          {
            beneficiariosContrDeslMesAtual: {
              queryMode: "findMany",
              select: {
                nome: true,
                historico: {
                  select: {
                    id: true,
                    situacaoVaga: {
                      select: {
                        nome: true,
                      },
                    },
                  },
                  where: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery.startOf("month").toISO(),
                      lte: dateToQuery.endOf("month").toISO(),
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                },
              },
              where: {
                historico: {
                  some: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery.startOf("month").toISO(),
                      lte: dateToQuery.endOf("month").toISO(),
                    },
                  },
                },
              },
            },
          },
        ],
      };

      // const { data: responseBeneficiarios } = await axios.get(
      //   `/api/${entity}/beneficiarios/dashboard`,
      //   {
      //     params: queryParamsBeneficiarios,
      //   }
      // );

      const { data: responseBeneficiarios } = await axios.get(
        getBackendRoute(entity, "beneficiarios/dashboard"),
        {
          params: queryParamsBeneficiarios,
        }
      );

      setBenefContrVsDeslGraphData(responseBeneficiarios);
    } catch (error) {
      toast(exceptionHandler(error));
    }
  };

  const getBenefContrVsDeslTrimChartData = async (rawDateToQuery) => {
    try {
      const dateToQuery = DateTime.fromISO(rawDateToQuery);

      const queryParamsBeneficiarios = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "findMany",
              select: {
                nome: true,
                historico: {
                  select: {
                    id: true,
                    situacaoVaga: {
                      select: {
                        nome: true,
                      },
                    },
                  },
                  where: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery.startOf("month").toISO(),
                      lte: dateToQuery.endOf("month").toISO(),
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                },
              },
              where: {
                historico: {
                  some: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery.startOf("month").toISO(),
                      lte: dateToQuery.endOf("month").toISO(),
                    },
                  },
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "findMany",
              select: {
                nome: true,
                historico: {
                  select: {
                    id: true,
                    situacaoVaga: {
                      select: {
                        nome: true,
                      },
                    },
                  },
                  where: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery
                        .plus({ month: 1 })
                        .startOf("month")
                        .toISO(),
                      lte: dateToQuery
                        .plus({ month: 1 })
                        .endOf("month")
                        .toISO(),
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                },
              },
              where: {
                historico: {
                  some: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery
                        .plus({ month: 1 })
                        .startOf("month")
                        .toISO(),
                      lte: dateToQuery
                        .plus({ month: 1 })
                        .endOf("month")
                        .toISO(),
                    },
                  },
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "findMany",
              select: {
                nome: true,
                historico: {
                  select: {
                    id: true,
                    situacaoVaga: {
                      select: {
                        nome: true,
                      },
                    },
                  },
                  where: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery
                        .plus({ months: 2 })
                        .startOf("month")
                        .toISO(),
                      lte: dateToQuery
                        .plus({ months: 2 })
                        .endOf("month")
                        .toISO(),
                    },
                  },
                  orderBy: {
                    createdAt: "desc",
                  },
                  take: 1,
                },
              },
              where: {
                historico: {
                  some: {
                    situacaoVaga: {
                      some: { OR: [{ nome: "Ativo" }, { nome: "Desligado" }] },
                    },
                    createdAt: {
                      gte: dateToQuery
                        .plus({ months: 2 })
                        .startOf("month")
                        .toISO(),
                      lte: dateToQuery
                        .plus({ months: 2 })
                        .endOf("month")
                        .toISO(),
                    },
                  },
                },
              },
            },
          },
        ],
      };
      const { data: responseBeneficiarios } = await axios.get(
        getBackendRoute(entity, "beneficiarios/dashboard"),
        {
          params: queryParamsBeneficiarios,
        }
      );

      setBenefContrVsDeslTrimGraphData(responseBeneficiarios);
    } catch (error) {
      toast(exceptionHandler(error));
    }
  };

  const getBenefPorLotePorTrimestre = async (rawDateToQuery) => {
    try {
      const dateToQuery = DateTime.fromISO(rawDateToQuery);

      const queryParamsBeneficiarios = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "findMany",
              where: {
                createdAt: {
                  gte: dateToQuery.startOf("month").toISO(),
                  lte: dateToQuery.endOf("month").toISO(),
                },
              },
              select: {
                _count: {
                  select: {
                    vaga: true,
                  },
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "findMany",
              where: {
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
              select: {
                _count: {
                  select: {
                    vaga: true,
                  },
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "findMany",
              where: {
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
              select: {
                _count: {
                  select: {
                    vaga: true,
                  },
                },
              },
            },
          },
        ],
      };

      const { data: responseRemessasSec } = await axios.get(
        getBackendRoute(entity, "remessas/dashboard"),
        {
          params: queryParamsBeneficiarios,
        }
      );

      const chartData = {
        series: [
          {
            name: "Beneficiários",
            data: Object.keys(responseRemessasSec).map((key) =>
              responseRemessasSec[key]
                .map(({ _count: { vaga } }) => vaga)
                .reduce((acc = 0, curr) => acc + curr, 0)
            ),
          },
        ],
        categories: Object.keys(responseRemessasSec).map((key) => key),
      };

      setBenefPorRemessaPorTrimestre(chartData);
    } catch (error) {
      toast(exceptionHandler(error));
    }
  };

  const getBenefAcolhimPorTrimestre = async (rawDateToQuery) => {
    try {
      const dateToQuery = DateTime.fromISO(rawDateToQuery);

      const queryParams = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                evento: {
                  tipoEvento: {
                    nome: "Seminário de Acolhimento",
                  },
                },
                createdAt: {
                  gte: dateToQuery.startOf("month").toISO(),
                  lte: dateToQuery.endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                evento: {
                  tipoEvento: {
                    nome: "Seminário de Acolhimento",
                  },
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                evento: {
                  tipoEvento: {
                    nome: "Seminário de Acolhimento",
                  },
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
        ],
      };

      const { data: responseSeminarios } = await axios.get(
        getBackendRoute(entity, "eventos/dashboard"),
        {
          params: queryParams,
        }
      );

      const chartData = {
        series: [
          {
            name: "Beneficiários",
            data: Object.keys(responseSeminarios).map(
              (key) => responseSeminarios[key]
              // .map(({ _count: { vaga } }) => vaga)
              // .reduce((acc = 0, curr) => acc + curr, 0)
            ),
          },
        ],
        categories: Object.keys(responseSeminarios).map((key) => key),
      };

      setBenefAcolhimPorTrimestre(chartData);
    } catch (error) {
      toast(exceptionHandler(error));
    }
  };

  const getMonitDashboardData = async (rawDateToQuery) => {
    try {
      const dateToQuery = DateTime.fromISO(rawDateToQuery);

      const queryMonitTrimestreParams = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                createdAt: {
                  gte: dateToQuery.startOf("month").toISO(),
                  lte: dateToQuery.endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
        ],
      };

      const queryAutoAvalTrimestreParams = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                autoAvaliacao_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.startOf("month").toISO(),
                  lte: dateToQuery.endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                autoAvaliacao_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                autoAvaliacao_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
        ],
      };

      const queryAvalAmbTrabTrimestreParams = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                ambienteTrabalho_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.startOf("month").toISO(),
                  lte: dateToQuery.endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                ambienteTrabalho_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                ambienteTrabalho_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
        ],
      };

      const queryAvalPntFocTrimestreParams = {
        transactionParams: [
          {
            [dateToQuery.toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                excluido: false,
                benefPontoFocal_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.startOf("month").toISO(),
                  lte: dateToQuery.endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ month: 1 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                excluido: false,
                benefPontoFocal_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
          {
            [dateToQuery.plus({ months: 2 }).toFormat("MM/yyyy")]: {
              queryMode: "count",
              where: {
                excluido: false,
                benefPontoFocal_anexoId: {
                  not: null,
                },
                createdAt: {
                  gte: dateToQuery.plus({ month: 1 }).startOf("month").toISO(),
                  lte: dateToQuery.plus({ month: 1 }).endOf("month").toISO(),
                },
              },
            },
          },
        ],
      };

      const { data: networkTime } = await axios.get(
        getBackendRoute(entity, "ext/time-ntp")
      );

      const periodosMonitoramentos = calcularPeriodoMonitoramentoRealizado(
        networkTime.toString()
      );

      const periodoMonitoramentoAtual = periodosMonitoramentos.find(
        ({ startDate, endDate }) =>
          startDate.toString() <= networkTime &&
          endDate.toString() >= networkTime
      );

      const { data: responseQueryMonitTrimestreParams } = await axios.get(
        getBackendRoute(entity, "monitoramentos/dashboard"),
        {
          params: {
            queryParams: queryMonitTrimestreParams,
            periodoMonitoramento: periodoMonitoramentoAtual,
          },
        }
      );

      // const { data: responseQueryAutoAvalTrimestreParams } = await axios.get(
      //   `/api/${entity}/monitoramento/dashboard`,
      //   {
      //     params: queryAutoAvalTrimestreParams,
      //   }
      // );

      const { data: responseQueryAutoAvalTrimestreParams } = await axios.get(
        getBackendRoute(entity, "monitoramentos/dashboard"),
        {
          params: {
            queryParams: queryMonitTrimestreParams,
            periodoMonitoramento: periodoMonitoramentoAtual,
          },
        }
      );

      const { data: responseQueryAvalAmbTrabTrimestreParams } = await axios.get(
        getBackendRoute(entity, "monitoramentos/dashboard"),
        {
          params: {
            queryParams: queryMonitTrimestreParams,
            periodoMonitoramento: periodoMonitoramentoAtual,
          },
        }
      );

      const { data: responseQueryAvalPntFocTrimestreParams } = await axios.get(
        getBackendRoute(entity, "monitoramentos/dashboard"),
        {
          params: {
            queryParams: queryMonitTrimestreParams,
            periodoMonitoramento: periodoMonitoramentoAtual,
          },
        }
      );

      const chartData = {
        queryMonitTrimestre: {
          series: [
            {
              name: "Monitoramentos",
              data: Object.keys(responseQueryMonitTrimestreParams).map(
                (key) => responseQueryMonitTrimestreParams[key]
                // .map(({ _count: { vaga } }) => vaga)
                // .reduce((acc = 0, curr) => acc + curr, 0)
              ),
            },
          ],
          categories: Object.keys(responseQueryMonitTrimestreParams).map(
            (key) => key
          ),
        },
        queryAutoAvalTrimestreParams: {
          series: [
            {
              name: "Monitoramentos",
              data: Object.keys(responseQueryAutoAvalTrimestreParams).map(
                (key) => responseQueryAutoAvalTrimestreParams[key]
                // .map(({ _count: { vaga } }) => vaga)
                // .reduce((acc = 0, curr) => acc + curr, 0)
              ),
            },
          ],
          categories: Object.keys(responseQueryAutoAvalTrimestreParams).map(
            (key) => key
          ),
        },
        queryAvalAmbTrabTrimestreParams: {
          series: [
            {
              name: "Monitoramentos",
              data: Object.keys(responseQueryAvalAmbTrabTrimestreParams).map(
                (key) => responseQueryAvalAmbTrabTrimestreParams[key]
                // .map(({ _count: { vaga } }) => vaga)
                // .reduce((acc = 0, curr) => acc + curr, 0)
              ),
            },
          ],
          categories: Object.keys(responseQueryAvalAmbTrabTrimestreParams).map(
            (key) => key
          ),
        },
        queryAvalPntFocTrimestreParams: {
          series: [
            {
              name: "Monitoramentos",
              data: Object.keys(responseQueryAvalPntFocTrimestreParams).map(
                (key) => responseQueryAvalPntFocTrimestreParams[key]
                // .map(({ _count: { vaga } }) => vaga)
                // .reduce((acc = 0, curr) => acc + curr, 0)
              ),
            },
          ],
          categories: Object.keys(responseQueryAvalPntFocTrimestreParams).map(
            (key) => key
          ),
        },
      };

      setMonitDashboardData(chartData);
    } catch (error) {
      toast(exceptionHandler(error));
    }
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    if (trimestreSelecionado) {
      getBenefPorLotePorTrimestre(trimestreSelecionado.startDate.toISO());
      getBenefContrVsDeslTrimChartData(trimestreSelecionado.startDate.toISO());
      getBenefAcolhimPorTrimestre(trimestreSelecionado.startDate.toISO());
      getMonitDashboardData(trimestreSelecionado.startDate.toISO());
    }
  }, [trimestreSelecionado]);

  useEffect(() => {
    if (!_.isEmpty(inputDateSelectContrDeslChart)) {
      getBenefContrVsDeslChartData(inputDateSelectContrDeslChart);
    }
  }, [inputDateSelectContrDeslChart]);

  const listaTrimestres = useCallback(() => {
    const todayDate = DateTime.now();
    return calcularPeriodoMonitoramentoRealizado(
      todayDate.toISO(),
      todayDate.month === 12 ? todayDate.year + 1 : todayDate.year
    );
  }, [])();

  useEffect(
    () =>
      setTrimestreSelecionado(
        listaTrimestres.find(
          ({ startDate, endDate, metaType }) =>
            DateTime.now() >= startDate &&
            DateTime.now() <= endDate &&
            metaType === "4.1"
        )
      ),

    []
  );

  const chartData = [
    {
      label: "A contratar",
      serie: benefGraphData && benefGraphData.beneficiariosAContratar,
    },
    {
      label: "Desistentes",
      serie: benefGraphData && benefGraphData.beneficiariosDesistentes,
    },
    {
      label: "Admitidos",
      serie: benefGraphData && benefGraphData.beneficiariosAtivos,
    },
    {
      label: "Transferidos",
      serie: benefGraphData && benefGraphData.beneficiariosTransferidos,
    },
    {
      label: "Pendentes",
      serie: benefGraphData && benefGraphData.beneficiariosPendentes,
    },
  ];

  const benefPorSexoChartData = [
    {
      label: "Masculino",
      serie: benefGraphData && benefGraphData.beneficiariosContratadosMasc,
    },
    {
      label: "Feminino",
      serie: benefGraphData && benefGraphData.beneficiariosContratadosFem,
    },
  ];

  const benefPorEtniaChartData = useMemo(
    () =>
      benefGraphData && {
        series: [
          {
            name: "Beneficiários",
            data: [
              (benefGraphData.beneficiariosContratadosEtnNA /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,

              (benefGraphData.beneficiariosContratadosEtnAm /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,

              (benefGraphData.beneficiariosContratadosEtnBr /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,

              (benefGraphData.beneficiariosContratadosEtnIn /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,

              (benefGraphData.beneficiariosContratadosEtnPa /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,

              (benefGraphData.beneficiariosContratadosEtnPr /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
            ],
          },
        ],
        categories: [
          "Não Informada",
          "Amarela",
          "Branca",
          "Indígena",
          "Parda",
          "Preta",
        ],
        dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefGraphData]
  );

  const benefPorFaixaEtariaChartData = useMemo(
    () =>
      benefGraphData && {
        series: [
          {
            name: "Beneficiários",
            data: [
              (benefGraphData.beneficiariosContratadosDataNasc.filter(
                ({ dataNasc }) => {
                  const idadeAtual = Math.floor(
                    -DateTime.fromISO(dataNasc).diffNow("years").years
                  );
                  return idadeAtual <= 20;
                }
              ).length /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
              (benefGraphData.beneficiariosContratadosDataNasc.filter(
                ({ dataNasc }) => {
                  const idadeAtual = Math.floor(
                    -DateTime.fromISO(dataNasc).diffNow("years").years
                  );
                  return idadeAtual >= 21 && idadeAtual <= 25;
                }
              ).length /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
              (benefGraphData.beneficiariosContratadosDataNasc.filter(
                ({ dataNasc }) => {
                  const idadeAtual = Math.floor(
                    -DateTime.fromISO(dataNasc).diffNow("years").years
                  );
                  return idadeAtual >= 26 && idadeAtual <= 30;
                }
              ).length /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
              (benefGraphData.beneficiariosContratadosDataNasc.filter(
                ({ dataNasc }) => {
                  const idadeAtual = Math.floor(
                    -DateTime.fromISO(dataNasc).diffNow("years").years
                  );
                  return idadeAtual >= 31 && idadeAtual <= 35;
                }
              ).length /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
              (benefGraphData.beneficiariosContratadosDataNasc.filter(
                ({ dataNasc }) => {
                  const idadeAtual = Math.floor(
                    -DateTime.fromISO(dataNasc).diffNow("years").years
                  );
                  return idadeAtual >= 36 && idadeAtual <= 40;
                }
              ).length /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
              (benefGraphData.beneficiariosContratadosDataNasc.filter(
                ({ dataNasc }) => {
                  const idadeAtual = Math.floor(
                    -DateTime.fromISO(dataNasc).diffNow("years").years
                  );

                  return idadeAtual >= 40;
                }
              ).length /
                benefGraphData.beneficiariosAtivos) *
                100 || 0,
            ],
          },
        ],
        categories: [
          "Até 20 anos",
          "21 a 25 anos",
          "26 a 30 anos",
          "31 a 35 anos",
          "36 a 40 anos",
          "Acima de 40 anos",
        ],
        dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefGraphData]
  );

  const template = useMemo(
    () =>
      benefGraphData && {
        series: [
          {
            name: "",
            data: [],
          },
        ],
        categories: [],
        dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefGraphData]
  );

  const benefPorFormacaoChartData = useMemo(
    () =>
      benefGraphData && {
        series: [
          {
            name: "Beneficiários",
            data: new Array().concat(
              benefGraphData.beneficiariosContratadosPorFormacao
                .sort(dynamicSort("beneficiarios", Number))
                .reverse()
                .filter((obj, idx) => idx <= 4)
                .map(
                  ({ beneficiarios }) =>
                    (beneficiarios.length /
                      benefGraphData.beneficiariosAtivos) *
                      100 || 0
                ),
              benefGraphData.beneficiariosContratadosPorFormacao
                .sort(dynamicSort("beneficiarios", Number))
                .reverse()
                .filter((obj, idx) => idx >= 5)
                .map(
                  ({ beneficiarios }) =>
                    (beneficiarios.length /
                      benefGraphData.beneficiariosAtivos) *
                      100 || 0
                )
                .reduce((prev, curr) => prev + curr)
            ),
          },
        ],
        categories: new Array().concat(
          benefGraphData.beneficiariosContratadosPorFormacao
            .sort(dynamicSort("beneficiarios", Number))
            .reverse()
            .filter((obj, idx) => idx <= 4)
            .map(({ nome }) => nome.replace("Técnico em ", "")),
          "Demais Formações"
        ),
        dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefGraphData]
  );

  const benefContrPorMesChartData = useMemo(
    () =>
      benefGraphData && {
        series: [
          {
            name: "Beneficiários",
            data: (function () {
              const qtdPorMes = benefGraphData.beneficiariosContratadosPorMes
                .map((obj) => ({
                  ...obj,
                  dataInicioAtividade: DateTime.fromISO(
                    obj.dataInicioAtividade
                  ).toFormat("MM/yyyy"),
                }))
                .reduce((acc, cur) => {
                  acc[cur.dataInicioAtividade] =
                    acc[cur.dataInicioAtividade] + cur._count || cur._count;
                  return acc;
                }, {});
              return Object.keys(qtdPorMes).map((key) => {
                const result =
                  (qtdPorMes[key] / benefGraphData.beneficiariosAtivos) * 100 ||
                  0;
                if (
                  result == Number.POSITIVE_INFINITY ||
                  result == Number.NEGATIVE_INFINITY
                ) {
                  return 0;
                } else {
                  return result;
                }
              });
            })(),
          },
        ],
        categories: (function () {
          const qtdPorMes = benefGraphData.beneficiariosContratadosPorMes
            .map((obj) => ({
              ...obj,
              dataInicioAtividade: DateTime.fromISO(
                obj.dataInicioAtividade
              ).toFormat("MM/yyyy"),
            }))
            .reduce((acc, cur) => {
              acc[cur.dataInicioAtividade] =
                acc[cur.dataInicioAtividade] + cur._count || cur._count;
              return acc;
            }, {});
          return Object.keys(qtdPorMes).map((key) => key);
        })(),
        dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefGraphData]
  );

  const benefContrVsDeslChartData =
    benefContrVsDeslGraphData &&
    benefContrVsDeslGraphData.beneficiariosContrDeslMesAtual.length === 0
      ? []
      : [
          {
            label: "Contratados",
            serie:
              benefContrVsDeslGraphData &&
              benefContrVsDeslGraphData.beneficiariosContrDeslMesAtual.filter(
                ({ historico }) =>
                  historico[0]?.situacaoVaga[0]?.nome === "Ativo"
              ).length,
          },
          {
            label: "Desligados",
            serie:
              benefContrVsDeslGraphData &&
              benefContrVsDeslGraphData.beneficiariosContrDeslMesAtual.filter(
                ({ historico }) =>
                  historico[0]?.situacaoVaga[0]?.nome === "Desligado"
              ).length,
          },
        ];

  const benefContrPorTerrChartData = useMemo(
    () =>
      benefGraphData && {
        series: [
          {
            name: "Beneficiários",
            data: benefGraphData.benefAtivosPorTerrIdent.map(
              ({ nome, municipios }) => {
                const result =
                  (municipios
                    .map(({ vagas }) => vagas.length)
                    .reduce((acc, curr) => acc + curr) /
                    benefGraphData.beneficiariosAtivos) *
                    100 || 0;
                if (
                  result == Number.POSITIVE_INFINITY ||
                  result == Number.NEGATIVE_INFINITY
                ) {
                  return 0;
                } else {
                  return result;
                }
              }
            ),
          },
        ],
        categories: benefGraphData.benefAtivosPorTerrIdent.map(
          ({ nome }) => nome
        ),
        dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefGraphData]
  );

  const benefPorRemessaPorTrimestreChartData = useMemo(
    () =>
      benefContrVsDeslTrimGraphData && {
        series: [
          {
            name: "Beneficiários Contratados",
            data: Object.keys(benefContrVsDeslTrimGraphData).map((key) => ({
              x: key,
              y: benefContrVsDeslTrimGraphData[key].filter(
                ({ historico }) =>
                  historico[0]?.situacaoVaga[0]?.nome === "Ativo"
              ).length,
            })),
          },
          {
            name: "Beneficiários Desligados",
            data: Object.keys(benefContrVsDeslTrimGraphData).map((key) => ({
              x: key,
              y: benefContrVsDeslTrimGraphData[key].filter(
                ({ historico }) =>
                  historico[0]?.situacaoVaga[0]?.nome === "Desligado"
              ).length,
              fillColor: "#C23829",
              strokeColor: "#C23829",
            })),
          },
        ],
        categories: Object.keys(benefContrVsDeslTrimGraphData).map(
          (key) => key
        ),
        // dataCount: benefGraphData.beneficiariosAtivos,
      },
    [benefContrVsDeslTrimGraphData]
  );

  const benefAcolhimPorTrimestreChartData = useMemo(
    () => benefAcolhimPorTrimestre && benefAcolhimPorTrimestre,
    [benefAcolhimPorTrimestre]
  );

  const monitPorTrimestreChartData = useMemo(
    () => monitDashboardData && monitDashboardData,
    [monitDashboardData]
  );

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <Stack spacing={6}>
        <Box>
          <Heading size="md" mb={3}>
            Beneficiários
          </Heading>
          <SimpleGrid columns={[1, 2, 2, 2]} spacing={6} pb={6}>
            <Card
              icon={FiUsers}
              label="Beneficiários Ativos"
              value={benefGraphData && benefGraphData.beneficiariosAtivos}
              isLoading={getheringData}
            />
            <Card
              icon={FiUsers}
              label="Total Beneficiários"
              value={
                benefGraphData && benefGraphData.beneficiariosTotal.toString()
              }
              isLoading={getheringData}
            />
          </SimpleGrid>
          <Collapse in={!getheringData} unmountOnExit>
            <SimpleGrid columns={[1, 1, 1, 2]} spacing={6}>
              <PieChart
                h={[300, 400]}
                chartData={chartData}
                label="Beneficiários por situação"
              />
              <PieChart
                h={[300, 400]}
                chartData={benefPorSexoChartData}
                label="Beneficiários contratados, por sexo"
              />
              <BarChart
                h={[300, 400]}
                chartData={benefPorEtniaChartData}
                label="Beneficiários contratados, por etnia"
              />

              <BarChart
                h={[300, 400]}
                chartData={benefPorFaixaEtariaChartData}
                label="Beneficiários contratados, por faixa etária"
              />

              <BarChart
                h={[300, 400]}
                chartData={benefPorFormacaoChartData}
                label="Beneficiários contratados, por formação"
                horizontal
              />

              <BarChart
                h={[300, 400]}
                chartData={benefContrPorMesChartData}
                label="Beneficiários contratados, mês a mês"
                // horizontal
              />

              <PieChart
                h={[300, 400]}
                chartData={benefContrVsDeslChartData}
                label="Beneficiários contratados e desligados, no mês"
                elementSelect={
                  // <FormMaker>{formInputsDateSelectContrDeslChart}</FormMaker>
                  <Input
                    size="sm"
                    defaultValue={inputDateSelectContrDeslChart}
                    type="month"
                    onChange={(e) =>
                      setInputDateSelectContrDeslChart(e.target.value)
                    }
                  />
                }
              />

              <BarChart
                h={[300, 400]}
                chartData={benefContrPorTerrChartData}
                label="Beneficiários contratados, por território de identidade"
              />

              <BarChart
                h={[300, 400]}
                chartData={benefPorRemessaPorTrimestre}
                label="Beneficiários contratados, por Lote SEC no trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />

              <BarChart
                h={[300, 400]}
                chartData={benefPorRemessaPorTrimestreChartData}
                label="Beneficiários contratados e desligados, por trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />

              <BarChart
                h={[300, 400]}
                chartData={benefAcolhimPorTrimestreChartData}
                label="Beneficiários acolhidos, por trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />
            </SimpleGrid>
          </Collapse>
        </Box>
        <Box>
          <Heading size="md" mb={3}>
            Monitoramentos
          </Heading>
          <SimpleGrid columns={[1, 2, 2, 3]} spacing={6} pb={6}>
            <Card
              icon={FiUsers}
              label="Beneficiários Aptos para Monitoramento"
              value={
                benefGraphData && benefGraphData.beneficiariosAtivos.toString()
              }
              isLoading={getheringData}
            />
            <Card
              icon={FiUsers}
              label="Monitoramentos Efetuados"
              value={
                benefGraphData &&
                `${monitRealizados} (${(
                  (monitRealizados / benefGraphData.beneficiariosAtivos) *
                    100 || 0
                ).toFixed(1)}%)`
              }
              isLoading={getheringData}
            />
            <Card
              icon={FiUsers}
              label="Monitoramentos Pendentes"
              value={
                benefGraphData &&
                `${benefGraphData.beneficiariosAtivos - monitRealizados}`
              }
              isLoading={getheringData}
            />
          </SimpleGrid>
          <Collapse in={!getheringData} unmountOnExit>
            <SimpleGrid columns={[1, 1, 1, 2]} spacing={6}>
              <BarChart
                h={[300, 400]}
                chartData={
                  monitPorTrimestreChartData &&
                  monitPorTrimestreChartData.queryMonitTrimestre
                }
                label="Monitoramentos efetuados, por trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />

              <BarChart
                h={[300, 400]}
                chartData={
                  monitPorTrimestreChartData &&
                  monitPorTrimestreChartData.queryAutoAvalTrimestreParams
                }
                label="Autoavaliações realizadas, por trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />

              <BarChart
                h={[300, 400]}
                chartData={
                  monitPorTrimestreChartData &&
                  monitPorTrimestreChartData.queryAvalAmbTrabTrimestreParams
                }
                label="Avaliações do Ambiente de Trabalho, por trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />

              <BarChart
                h={[300, 400]}
                chartData={
                  monitPorTrimestreChartData &&
                  monitPorTrimestreChartData.queryAvalPntFocTrimestreParams
                }
                label="Avaliações do Beneficiários pelo Ponto Focal, por trimestre"
                percentage={false}
                elementSelect={
                  <Select
                    size="sm"
                    value={trimestreSelecionado && trimestreSelecionado.id}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setTrimestreSelecionado(
                        listaTrimestres.find(({ id }) => id === e.target.value)
                      )
                    }
                  >
                    {listaTrimestres &&
                      listaTrimestres
                        .filter(({ metaType }) => metaType === "4.1")
                        .map(({ id, label }) => (
                          <option key={label} value={id}>
                            {label}
                          </option>
                        ))}
                  </Select>
                }
              />
            </SimpleGrid>
          </Collapse>
        </Box>
      </Stack>
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
