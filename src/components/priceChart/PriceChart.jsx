import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import _ from 'lodash';
import useWebSocket from "../../hooks/useWebsokcet.js";
import './priceChart.css';
import { useSelector } from 'react-redux';

Chart.register(...registerables);

const PriceChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Price',
                data: [],
                borderColor: 'rgb(77,212,215)',
                backgroundColor: 'rgba(25,245,245,0.2)',
                borderWidth: 2,
                fill: false,
                segment: {
                    borderColor: ctx => {
                        const color = ctx.p0.parsed.y > ctx.p1.parsed.y ? 'rgb(192,75,75)' : 'rgb(0,0,0,0.2)';
                        return skipped(ctx, color);
                    },

                },
                spanGaps: false,
                tension: 0.1,
            },
            {
                label: 'Fixed Price',
                data: [],
                borderColor: 'rgb(255,0,0)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                borderDash: [5, 5],
            },
        ],
    });

    const [fixedPrice, setFixedPrice] = useState(null);
    const betInProgress = useSelector(state => state.bet.betInProgress);
    const currentPrice = useSelector(state => state.bet.currentPrice);

    useEffect(() => {
        if (betInProgress) {
            setFixedPrice(currentPrice);
        }
    }, [betInProgress, currentPrice]);

    useEffect(() => {
        if (fixedPrice !== null) {
            setChartData(prevData => {
                const updatedLabels = [...prevData.labels];
                const fixedPriceData = updatedLabels.map(() => fixedPrice);

                return {
                    ...prevData,
                    datasets: [
                        prevData.datasets[0],
                        {
                            ...prevData.datasets[1],
                            data: fixedPriceData,
                        },
                    ],
                };
            });
        }
    }, [fixedPrice]);

    const debounceUpdateChartData = useRef(_.debounce((newData) => {
        setChartData(prevData => {
            const updatedLabels = [...prevData.labels, newData.label].slice(-20);
            const updatedData = [...prevData.datasets[0].data, newData.data].slice(-20);

            const borderColor = updatedData.length > 1 && updatedData[updatedData.length - 1] < updatedData[updatedData.length - 2]
                ? 'red'
                : 'green';

            return {
                labels: updatedLabels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: updatedData,
                        borderColor,
                    },
                    {
                        ...prevData.datasets[1],
                        data: updatedLabels.map(() => fixedPrice),
                    },
                ],
            };
        });
    }, 300)).current;

    const handleWebSocketMessage = useCallback((event) => {
        const message = JSON.parse(event.data);
        if (message.e === 'trade') {
            debounceUpdateChartData({
                label: new Date(),
                data: parseFloat(message.p),
            });
        }
    }, []);

    const wsUrl = 'wss://stream.binance.com:9443/ws/btcusdt@trade';
    useWebSocket(wsUrl, handleWebSocketMessage);

    const options = useMemo(() => ({
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 30,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Price',
                },
                beginAtZero: false,
                suggestedMin: Math.min(...chartData.datasets[0].data) - 10,
                suggestedMax: Math.max(...chartData.datasets[0].data) + 10,
            },
        },
        elements: {
            line: {
                borderWidth: 2,
            },
        },
        maintainAspectRatio: false,
        aspectRatio: 2,
    }), [chartData]);

    const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

    return (
        <div className='chart-container'>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PriceChart;
