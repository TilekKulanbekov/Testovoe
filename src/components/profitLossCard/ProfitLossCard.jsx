import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';

const ProfitLossCard = ({ profitLoss }) => {
    const isProfit = profitLoss > 0;
    const message = isProfit ? 'Прибыль' : 'Убыток';

    return (
        <Card
            sx={{
                maxWidth: 345,
                backgroundColor: isProfit ? green[100] : red[100],
                borderColor: isProfit ? green[500] : red[500],
                border: '1px solid',
                marginTop: 2
            }}
        >
            <CardContent>
                <Typography variant="h5" component="div" color={isProfit ? green[800] : red[800]}>
                    {message}
                </Typography>
                <Typography variant="h6" component="div" color="textSecondary">
                    ${profitLoss.toFixed(2)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProfitLossCard;
