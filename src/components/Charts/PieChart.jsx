/**
 * Componente de Gráficos do Dashboard
 * @module Charts
 */

import { Box, Center, Flex, Heading, HStack, Icon } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { FiAlertCircle, FiAlertTriangle } from "react-icons/fi";

// Chama o import do gráfico sem Server-Side Render
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/*************** WIP ******************/
/**
 * Cria componente de gráfico.
 * @method PieChart
 * @memberof module:Charts
 * @returns componente de card.
 */
export function PieChart({
  chartData,
  label,
  w = "100%",
  h = "100%",
  elementSelect,
}) {
  const chartConfig = {
    series: chartData.map(({ serie }) => serie),
    labels: chartData.map(({ label }) => label),
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#3f6dc0",
        shadeIntensity: 1,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return `${opt.w.globals.labels[opt.seriesIndex]} : ${val.toFixed(2)}%`;
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#284882"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderWidth: 0,
        borderRadius: 10,
        padding: 10,
      },
    },
    legend: {
      show: false,
    },
    noData: {
      text: "No Data",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#284882",
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        borderWidth: 0,
        borderRadius: 10,
        padding: 10,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                },
              },
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: true,
            formatter: function (seriesName, opts) {
              return `${seriesName} : ${opts.w.globals.seriesPercent[
                opts.seriesIndex
              ][0].toFixed(2)}%`;
            },
            fontWeight: "bold",
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Box
      bg="white"
      rounded="lg"
      shadow="sm"
      alignItems="center"
      justifyContent="center"
      pb={7}
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
      {_.isEmpty(chartData) ? (
        <Center h="full">
          <Flex
            flexDir="column"
            alignItems="center"
            color="brand1.300"
            rounded="full"
            p={2}
          >
            <Icon as={FiAlertCircle} boxSize={10} mb={2} mt="1px" />
            <Heading size="lg">Sem dados</Heading>
          </Flex>
        </Center>
      ) : (
        <ReactApexChart
          type="donut"
          options={chartConfig}
          series={chartConfig.series}
          width="100%"
          height="100%"
        />
      )}
    </Box>
  );
}
