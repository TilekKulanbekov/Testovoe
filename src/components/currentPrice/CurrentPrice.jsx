import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box } from '@mui/material';

const CurrentPrice = ({ onPriceUpdate }) => {
    const [price, setPrice] = useState(0);

    useEffect(() => {
        const fetchPrice = () => {
            axios
                .get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
                .then((response) => {
                    const newPrice = parseFloat(response.data.price);
                    if (newPrice !== price) {
                        setPrice(newPrice);
                        onPriceUpdate(newPrice);
                    }
                })
                .catch((error) => console.error('Error fetching price:', error));
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 1000);
        return () => clearInterval(interval);
    }, [onPriceUpdate, price]);


    return (
        <Box mb={2}>
            <Typography variant="h5">Current Price: ${price.toFixed(2)}</Typography>
        </Box>
    );
};

export default CurrentPrice;
