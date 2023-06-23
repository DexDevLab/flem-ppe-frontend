import { DateTime } from "luxon";

/**
 * Calcula o Período de Monitoramento atual considerando a hora do sistema provida
 * pelo Backend.
 * @method calcularPeriodoMonitoramentoAtual
 * @memberof module:monitoramento
 * @param {DateTime} networkTime a hora atual do sistema provida pelo Backend.
 * @returns {Object} Objeto contendo as informações sobre os períodos disponíveis e suas
 * datas, baseado nas Regras de Negócio dos Trimestres do SMB:
 *
 * id - o ID do Objeto
 *
 * startDate - a data de início do período.
 *
 * cutDate - a Data de Corte para o período. Contratações até ANTES da Data de Corte devem ter
 * seu monitoramento realizado dentro do período. Caso contrário, o primeiro monitoramento do
 * beneficiário deve ser realizado no próximo período. O padrão da Data de Corte é o dia 10 do mês.
 *
 * endDate - a data de fim do período.
 *
 * label - como o período será exibido no Frontend.
 *
 * metaType - o tipo de submeta do SMB: 4.1 (Período Trimestral) ou 4.2 (Período Semestral).
 *
 */
export const calcularPeriodoMonitoramentoAtual = (networkTime) => [
  {
    id: "1",
    startDate: DateTime.fromFormat("01/12", "dd/MM")
      .setLocale("pt-BR")
      .plus(
        [1, 2].includes(DateTime.fromISO(networkTime).month)
          ? { year: -1 }
          : { year: 0 }
      ),
    cutDate: DateTime.fromFormat("10/12", "dd/MM")
      .setLocale("pt-BR")
      .plus(
        [1, 2].includes(DateTime.fromISO(networkTime).month)
          ? { year: -1 }
          : { year: 0 }
      ),
    endDate: DateTime.fromFormat("28/02", "dd/MM")
      .setLocale("pt-BR")
      .plus(
        [1, 2].includes(DateTime.fromISO(networkTime).month)
          ? { year: 0 }
          : { year: 1 }
      ),
    label: `01/12 a ${
      DateTime.fromISO(networkTime).setLocale("pt-BR").isInLeapYear
        ? "29/02"
        : "28/02"
    }`,
    metaType: "4.1",
  },
  {
    id: "2",
    startDate: DateTime.fromFormat("01/03", "dd/MM").setLocale("pt-BR"),
    cutDate: DateTime.fromFormat("10/03", "dd/MM").setLocale("pt-BR"),
    endDate: DateTime.fromFormat("31/05", "dd/MM").setLocale("pt-BR"),
    label: "01/03 a 31/05",
    metaType: "4.1",
  },
  {
    id: "3",
    startDate: DateTime.fromFormat("01/06", "dd/MM").setLocale("pt-BR"),
    cutDate: DateTime.fromFormat("10/06", "dd/MM").setLocale("pt-BR"),
    endDate: DateTime.fromFormat("31/08", "dd/MM").setLocale("pt-BR"),
    label: "01/06 a 31/08",
    metaType: "4.1",
  },
  {
    id: "4",
    startDate: DateTime.fromFormat("01/09", "dd/MM").setLocale("pt-BR"),
    cutDate: DateTime.fromFormat("10/09", "dd/MM").setLocale("pt-BR"),
    endDate: DateTime.fromFormat("30/11", "dd/MM").setLocale("pt-BR"),
    label: "01/09 a 30/11",
    metaType: "4.1",
  },
  {
    id: "5",
    startDate: DateTime.fromFormat("01/12", "dd/MM")
      .setLocale("pt-BR")
      .plus(
        [1, 2, 3, 4, 5].includes(DateTime.fromISO(networkTime).month)
          ? { year: -1 }
          : { year: 0 }
      ),
    cutDate: DateTime.fromFormat("10/12", "dd/MM")
      .setLocale("pt-BR")
      .plus(
        [1, 2, 3, 4, 5].includes(DateTime.fromISO(networkTime).month)
          ? { year: -1 }
          : { year: 0 }
      ),
    endDate: DateTime.fromFormat("31/05", "dd/MM")
      .setLocale("pt-BR")
      .plus(
        [1, 2, 3, 4, 5].includes(DateTime.fromISO(networkTime).month)
          ? { year: 0 }
          : { year: 1 }
      ),
    label: "01/12 a 31/05",
    metaType: "4.2",
  },
  {
    id: "6",
    startDate: DateTime.fromFormat("01/06", "dd/MM").setLocale("pt-BR"),
    cutDate: DateTime.fromFormat("10/06", "dd/MM").setLocale("pt-BR"),
    endDate: DateTime.fromFormat("30/11", "dd/MM").setLocale("pt-BR"),
    label: "01/06 a 30/11",
    metaType: "4.2",
  },
];

/**
 * Calcula o Período de Monitoramento realizado considerando a hora do sistema provida
 * pelo Backend.
 * @method calcularPeriodoMonitoramentoRealizado
 * @memberof module:monitoramento
 * @param {DateTime} networkTime a hora atual do sistema provida pelo Backend.
 * @param {DateTime} anoSelecionado o ano selecionado na interface. Como padrão, provê o ano atual
 * baseado na hora e data atual do sistema provida pelo Backend.
 * @returns {Object} Objeto contendo as informações sobre os períodos disponíveis e suas
 * datas, baseado nas Regras de Negócio dos Trimestres do SMB:
 *
 * id - o ID do Objeto
 *
 * startDate - a data de início do período.
 *
 * cutDate - a Data de Corte para o período. Contratações até ANTES da Data de Corte devem ter
 * seu monitoramento realizado dentro do período. Caso contrário, o primeiro monitoramento do
 * beneficiário deve ser realizado no próximo período. O padrão da Data de Corte é o dia 10 do mês.
 *
 * endDate - a data de fim do período.
 *
 * label - como o período será exibido no Frontend.
 *
 * metaType - o tipo de submeta do SMB: 4.1 (Período Trimestral) ou 4.2 (Período Semestral).
 *
 */
export const calcularPeriodoMonitoramentoRealizado = (
  networkTime,
  anoSelecionado = DateTime.fromISO(networkTime).year
) => {
  const todayDate = DateTime.fromISO(networkTime).setLocale("pt-BR");
  return [
    {
      id: "1",
      startDate: DateTime.fromFormat("01/12", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .startOf("day")
        .plus({ year: -1 }),
      cutDate: DateTime.fromFormat("10/12", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day")
        .plus({ year: -1 }),
      endDate: DateTime.fromFormat("28/02", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      label: `01/12/${anoSelecionado - 1} a ${
        DateTime.fromISO(networkTime).setLocale("pt-BR").isInLeapYear
          ? "29/02"
          : "28/02"
      }/${anoSelecionado}`,
      metaType: "4.1",
    },
    {
      id: "2",
      startDate: DateTime.fromFormat("01/03", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .startOf("day"),
      cutDate: DateTime.fromFormat("10/03", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      endDate: DateTime.fromFormat("31/05", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      label: `01/03/${anoSelecionado} a 31/05/${anoSelecionado}`,
      metaType: "4.1",
    },
    {
      id: "3",
      startDate: DateTime.fromFormat("01/06", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .startOf("day"),
      cutDate: DateTime.fromFormat("10/06", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      endDate: DateTime.fromFormat("31/08", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      label: `01/06/${anoSelecionado} a 31/08/${anoSelecionado}`,
      metaType: "4.1",
    },
    {
      id: "4",
      startDate: DateTime.fromFormat("01/09", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .startOf("day"),
      cutDate: DateTime.fromFormat("10/09", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      endDate: DateTime.fromFormat("30/11", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      label: `01/09/${anoSelecionado} a 30/11/${anoSelecionado}`,
      metaType: "4.1",
    },
    {
      id: "5",
      startDate: DateTime.fromFormat("01/12", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .startOf("day")
        .plus({ year: -1 }),
      cutDate: DateTime.fromFormat("10/12", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day")
        .plus({ year: -1 }),
      endDate: DateTime.fromFormat("31/05", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      label: `01/12/${anoSelecionado - 1} a 31/05/${anoSelecionado}`,
      metaType: "4.2",
    },
    {
      id: "6",
      startDate: DateTime.fromFormat("01/06", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .startOf("day"),
      cutDate: DateTime.fromFormat("10/06", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      endDate: DateTime.fromFormat("30/11", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day"),
      label: `01/06/${anoSelecionado} a 30/11/${anoSelecionado}`,
      metaType: "4.2",
    },
  ];
};
