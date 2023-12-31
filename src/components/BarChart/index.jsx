import React, { useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { token } from "../../theme";

import { fetchRevenue } from "../../libs/userService";

const BarChart = ({ isDashboard = false, filterValue }) => {
  const theme = useTheme();
  const colors = token(theme.palette.mode);
  const [yearlyRevenue, setYearlyRevenue] = React.useState([]);

  useEffect(() => {
    fetchRevenue(filterValue)
      .then((res) => {
        setYearlyRevenue(res.data);
        console.log(res.data);
      })
      .catch((err) => {});
  }, [filterValue]);

  return (
    <ResponsiveBar
      data={yearlyRevenue.map((item) => ({
        Tháng: item.month,
        Bán: item.orderRevenue,
        "Đấu giá": item.auctionRevenue,
      }))}
      valueFormat={(value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value)
      }
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.gray[100],
            },
          },
          legend: {
            text: {
              fill: colors.gray[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.gray[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.gray[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.gray[100],
          },
        },
        tooltip: {
          container: {
            background: colors.gray[100],
            color: colors.gray[900],
          },
        },
      }}
      keys={["Bán", "Đấu giá"]}
      indexBy='Tháng'
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "tháng",
        legendPosition: "end",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "VND",
        legendPosition: "end",
        legendOffset: -40,
        format: (value) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value),
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: true,
          translateX: 121,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role='application'
      label={(e) =>
        `${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(e.value)}`
      }
      ariaLabel='Nivo bar chart demo'
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );
};

export default BarChart;
