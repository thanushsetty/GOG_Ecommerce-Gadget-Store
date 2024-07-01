import { CardsData } from "../Data/Data";
import "../styles/Cards.css";
import React, { useState } from "react";
import "../styles/Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, LayoutGroup } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilUsdSquare,
  UilMoneyWithdrawal,
} from "@iconscout/react-unicons";

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <LayoutGroup id="b">
      {expanded ? (
        <ExpandedCard
          param={props}
          months={props.months}
          setExpanded={() => {
            setExpanded(false);
          }}
        />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </LayoutGroup>
  );
};

function CompactCard({ param, setExpanded }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      onClick={setExpanded}
      layoutId="expandableCard"
    >
      <div className="radialBar">
        <span>{param.title}</span>
        <CircularProgressbar value={param.value} text={`${param.value}`} />
      </div>

      <div className="detail">
        <Png />
        <span>{param.value} users</span>
        <span>Last 24 Hours</span>
      </div>
    </motion.div>
  );
}

function ExpandedCard({ param, setExpanded, months }) {
  const data = {
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      dropShadow: {
        enabled: false,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.35,
      },
      fill: {
        color: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["white"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: months,
      },
    },
  };
  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        <Chart series={param.series} type="area" options={data.options} />
      </div>
      <span>Last 24 Hours</span>
    </motion.div>
  );
}

const card = [
  {
    title: "Users",
    color: {
      backGround: "linear-gradient(180deg, #efb369 0%, #c97d20 100%)",
      boxShadow: "0px 10px 20px 0px #e0c6f5",
    },
    barValue: 70,
    value: "25,970",
    png: UilUsersAlt,
    series: [
      {
        name: "Sales",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
];

const Cards = (props) => {
  const orders = props.sales;

  // Extract unique user IDs from the orders' data
  const uniqueUsers = Array.from(new Set(orders.map((order) => order.userId)));

  const orderDates = orders.map((order) => new Date(order.createdAt));

  const ordersByMonth = {};
  orderDates.forEach((date) => {
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
    ordersByMonth[yearMonth] = (ordersByMonth[yearMonth] || 0) + 1;
  });

  const months = [];
  const uniqueUserCounts = []; // Array to store unique user counts

  const today = new Date();
  let currentMonth = today.getMonth() + 1;
  let currentYear = today.getFullYear();

  for (let i = 0; i < 6; i++) {
    if (currentMonth === 0) {
      currentMonth = 12;
      currentYear--;
    }
    const yearMonth = `${currentYear}-${currentMonth}`;
    months.unshift(yearMonth);
    uniqueUserCounts.unshift(ordersByMonth[yearMonth] || 0); // Count unique users for each month
    currentMonth--;
  }

  // Calculate the total unique users for the past 6 months
  let totalUniqueUsers = uniqueUserCounts.reduce(
    (total, count) => total + count,
    0
  );

  const order_data = [
    {
      name: "Sales",
      data: uniqueUserCounts,
    },
  ];

  return (
    <div className="Cards">
      <div className="parentContainer">
        <Card
          title={card[0].title}
          color={card[0].color}
          barValue={card[0].barValue}
          value={totalUniqueUsers}
          png={card[0].png}
          series={card[0].series}
          months={months}
        />
      </div>
    </div>
  );
};

export default Cards;
