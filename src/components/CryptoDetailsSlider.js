import React, { useState, useEffect } from 'react';
import api from '../api/api';
import ReactApexChart from 'react-apexcharts';

const CryptoDetails = ({ crypto, convert }) => {
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("4hours");

  useEffect(() => {
    fetchCandlestickData();
  }, [crypto.crypto._id, timePeriod]);

  const fetchCandlestickData = async () => {
    setIsLoading(true);
    try {
      const response = await api.getCandlesticksData(crypto.crypto._id, timePeriod);
      if (response && response.data && response.data.candlesticks) {
        const transformedData = {
          data: response.data.candlesticks.map(candle => ({
            x: new Date(candle.timestamp),
            y: [convert(candle.open), convert(candle.high), convert(candle.low), convert(candle.close)]
          }))
        };
        setSeries([transformedData]);
      }
    } catch (error) {
      console.error("Error fetching candlestick data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      }
      
    },
    title: {
      text: timePeriod,
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    },
    
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 m-4"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <select value={timePeriod} onChange={handleTimePeriodChange} className="p-2 border rounded">
          <option value="30mins">30 mins</option>
          <option value="4hours">4 hours</option>
          <option value="4days">4 days</option>
        </select>
      </div>

      {series.length > 0 && (
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={350}
        />
      )}
    </div>
  );
};

export default CryptoDetails;