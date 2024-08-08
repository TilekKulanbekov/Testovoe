import React from 'react';
import {Typography, Stack} from '@mui/material';
import './balance.css';

const Balance = ({ balance }) => {
    return (
        <Stack mb={2} className='balance'>
            <Typography variant="h5" color='gray' fontSize={18}>Balance:</Typography>
            <Typography variant="h5">${balance.toFixed(2)}</Typography>
        </Stack>
    );
};

export default Balance;
