/**
 * Componente de Gráficos do Dashboard
 * @module Charts
 */

import { Box, Heading, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Chama o import do gráfico sem Server-Side Render
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/*************** WIP ******************/
/**
 * Cria componente de gráfico.
 * @method BarChart
 * @memberof module:Charts
 * @returns componente de card.
 */
export function BarChart({
  chartData,
  label,
  w = "100%",
  h = "100%",
  horizontal,
  elementSelect,
  percentage = true,
}) {
  const chartConfig = {
    series: chartData.series,

    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
        horizontal,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "130px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#284882"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderWidth: 0,
        borderRadius: 10,
        padding: 6,
      },
      formatter: (value) => (percentage ? value.toFixed(2) + "%" : value),
      textAnchor: horizontal ? "start" : "middle",
      offsetX: horizontal ? 4 : 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          fontSize: horizontal ? "12px" : "14px",
          fontWeight: "bold",
        },
        formatter: (value) =>
          horizontal ? (percentage ? `${value}%` : value) : value,
      },
    },
    yaxis: {
      forceNiceScale: false,
      labels: {
        formatter: (value) =>
          horizontal ? value : `${value}${percentage ? "%" : ""}`,
        style: {
          fontSize: horizontal ? "14px" : "12px",
          fontWeight: "bold",
        },
        offsetX: 4,
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#3f6dc0",
        shadeIntensity: 1,
      },
    },
    tooltip: {
      x: {
        formatter: function (seriesName) {
          return `${seriesName} `;
        },
      },
      y: {
        formatter: (value) =>
          percentage
            ? `${((value * chartData.dataCount) / 100).toFixed(
                0
              )} (${value.toFixed(2)}%)`
            : value,
      },
    },
  };

  return (
    <Box
      bg="white"
      rounded="lg"
      shadow="sm"
      alignItems="center"
      justifyContent="center"
      pb={12}
      w={w}
      h={h}
    >
      <HStack alignItems="center" pt={5} px={5}>
        {label && (
          <Heading as="h3" color="gray.400" size="sm" w="100%">
            {label}
          </Heading>
        )}
        {elementSelect && elementSelect}
      </HStack>
      <Box h="full" w="full" pe={4} ps={2}>
        <ReactApexChart
          type="bar"
          options={chartConfig}
          series={chartConfig.series}
          width="100%"
          height="100%"
        />
      </Box>
    </Box>
  );
}
