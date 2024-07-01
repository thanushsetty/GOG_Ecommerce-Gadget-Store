import { CardsData } from "../Data/Data";
import "../styles/Cards.css";
import React, { useState, useEffect } from "react";
import "../styles/Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, LayoutGroup } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";
import axios from "axios";
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
  // console.log(props.months);
  const [expanded1, setExpanded1] = useState(false);
  return (
    <LayoutGroup id="a">
      {expanded1 ? (
        <ExpandedCard1
          param={props}
          months={props.months}
          setExpanded1={() => setExpanded1(false)}
        />
      ) : (
        <CompactCard1 param={props} setExpanded1={() => setExpanded1(true)} />
      )}
    </LayoutGroup>
  );
};

function CompactCard1({ param, setExpanded1 }) {
  const Png = param.png;
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
      onClick={setExpanded1}
      layoutId="expandableCard"
    >
      <div className="radialBar">
        <span>Users</span>
        <CircularProgressbar value={param.value} text={`${param.value}`} />
      </div>

      <div className="detail">
        <Png />
        <span>{param.value} users</span>
        <span>Last 6 months</span>
      </div>
    </motion.div>
  );
}

function ExpandedCard1({ param, setExpanded1, months }) {
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
        <UilTimes onClick={setExpanded1} />
      </div>
      <span>{param.title}</span>
      <div className="chartContainer">
        <Chart series={param.series} type="area" options={data.options} />
      </div>
      <span>Last 6 months</span>
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
        name: "Users",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
];

const Cards = (props) => {
  const orders = props.users;

  const orderDates = orders.map((order) => new Date(order.createdAt));

  const ordersByMonth = {};
  orderDates.forEach((date) => {
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
    ordersByMonth[yearMonth] = (ordersByMonth[yearMonth] || 0) + 1;
  });

  const months = [];
  const orderCounts = [];

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
    orderCounts.unshift(ordersByMonth[yearMonth] || 0);
    currentMonth--;
  }
  let total_orders = orderCounts.reduce((total, count) => total + count, 0);

  // console.log(months);
  // console.log(orderCounts);
  // console.log(total_orders);

  const order_data = [
    {
      name: "Users",
      data: orderCounts,
    },
  ];

  return (
    <div className="Cards">
      <div className="parentContainer">
        <Card
          title={card[0].title}
          color={card[0].color}
          barValue={card[0].barValue}
          value={total_orders}
          png={card[0].png}
          series={order_data}
          months={months}
        />
      </div>
    </div>
  );
};

export default Cards;
