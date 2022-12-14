import { DateTime } from "luxon";
import _ from "lodash";

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
        .plus({ year: todayDate.month === 12 ? -1 : 0 }),
      cutDate: DateTime.fromFormat("10/12", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day")
        .plus({ year: todayDate.month === 12 ? -1 : 0 }),
      endDate: DateTime.fromFormat("28/02", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day")
        .plus({ year: todayDate.month === 12 ? 0 : 1 }),
      label: `01/12/${
        todayDate.month === 12 ? anoSelecionado - 1 : anoSelecionado
      } a ${
        DateTime.fromISO(networkTime).setLocale("pt-BR").isInLeapYear
          ? "29/02"
          : "28/02"
      }/${todayDate.month === 12 ? anoSelecionado : anoSelecionado + 1}`,
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
        .plus({ year: todayDate.month === 12 ? -1 : 0 }),
      cutDate: DateTime.fromFormat("10/12", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .endOf("day")
        .plus({ year: todayDate.month === 12 ? -1 : 0 }),
      endDate: DateTime.fromFormat("31/05", "dd/MM")
        .setLocale("pt-BR")
        .set({ year: anoSelecionado })
        .plus({ year: todayDate.month === 12 ? 0 : 1 })
        .endOf("day"),
      label: `01/12/${
        todayDate.month === 12 ? anoSelecionado - 1 : anoSelecionado
      } a 31/05/${
        todayDate.month === 12 ? anoSelecionado : anoSelecionado + 1
      }`,
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
