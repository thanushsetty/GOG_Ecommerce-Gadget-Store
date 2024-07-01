import React from "react";
import Chart from "react-apexcharts";
import "../styles/CustomerReviews.css";

export const CustomerReview = ({ sellerReviews }) => {

  const currentTime = new Date();

  const lastTwentyFourHoursTimestamps = [];

  for (let i = 24; i >= 0; i -= 4) {
    const hourStart = new Date(currentTime);
    hourStart.setHours(currentTime.getHours() - i, 0, 0, 0);
    const isoString = hourStart.toISOString();
    lastTwentyFourHoursTimestamps.push(isoString);
  }
  
  const reviewCounts = Array.from({ length: 6 }).fill(0);

  for (let i = 0; i < 6; i++) {
    const hourStart = new Date(lastTwentyFourHoursTimestamps[i]);
    const hourEnd = new Date(hourStart);
    hourEnd.setHours(hourEnd.getHours() + 4); 
    const reviewsInInterval = sellerReviews.filter((review) => {
      const reviewTime = new Date(review.createdAt);
      return reviewTime >= hourStart && reviewTime < hourEnd;
    });
  
    reviewCounts[i] = reviewsInInterval.length;
  }

  const data = {
    series: [
      {
        name: "Review Count",
        data: reviewCounts,
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      fill: {
        colors: ["#cf7608"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#5f9ea0"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: "datetime",
        categories: lastTwentyFourHoursTimestamps
      },
      yaxis: {
        show: false,
      },
      toolbar: {
        show: false,
      },
    },
  };


  return (
    <div className="CustomerReview">
      <Chart options={data.options} series={data.series} type="area" />
    </div>
  );
};
