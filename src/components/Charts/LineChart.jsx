/**
 * Componente de Gráficos do Dashboard
 * @module Charts
 */

import { Box, Flex, Heading, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Chama o import do gráfico sem Server-Side Render
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/*************** WIP ******************/
/**
 * Cria componente de gráfico.
 * @method LineChart
 * @memberof module:Charts
 * @returns componente de card.
 */
export function LineChart({
  data,
  label,
  w = "100%",
  h = "100%",
  horizontal,
  elementSelect,
  percentage = true,
}) {
  const chartData = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      strokeDashArray: 5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#3F6DC0", "#192C4D"],
    },
    colors: ["#3F6DC0", "#192C4D"],
    series: data,
  };

  return (
    <Flex
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
      <Box ps={2} w="100%" h="100%">
        <ReactApexChart
          options={chartData}
          series={chartData.series}
          type="area"
          width="100%"
          height="100%"
        />
      </Box>
    </Flex>
  );
}
