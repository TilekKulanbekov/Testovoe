import React, {useCallback, useState} from 'react';
import {Button, Box, ButtonGroup, Typography, Stack} from '@mui/material';
import './betForm.css'
import { BsGraphDownArrow } from "react-icons/bs";
import { BsGraphUpArrow } from "react-icons/bs";


const BetForm = ({ balance, onBet, disabled, remainingTime }) => {
    const [betAmount, setBetAmount] = useState(100);
    const [direction, setDirection] = useState('up');

    const handleBet = useCallback(() => {
        if (betAmount <= balance) {
            onBet(betAmount, direction);
        } else {
            alert('Недостаточно средств для ставки');
        }
    }, [betAmount, balance, direction, onBet]);

    const increaseBet = useCallback(() => {
        setBetAmount(prevAmount => prevAmount + 100);
    }, []);

    const decreaseBet = useCallback(() => {
        setBetAmount(prevAmount => Math.max(prevAmount - 100, 100));
    }, []);

    return (
        <Stack spacing={2} mb={2}>
            <ButtonGroup fullWidth variant="contained" className="btns" color="primary" disabled={disabled}>
                <Button
                    onClick={() => setDirection('up')}
                    className="up"
                    variant={direction === 'up' ? 'contained' : 'outlined'}
                    color="success"
                    endIcon={<BsGraphUpArrow />}
                >
                    Вверх
                </Button>
                <Button
                    onClick={() => setDirection('down')}
                    className="down"
                    variant={direction === 'down' ? 'contained' : 'outlined'}
                    color="error"
                    endIcon={<BsGraphDownArrow />}
                >
                    Вниз
                </Button>
            </ButtonGroup>

            <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                <Button
                    onClick={decreaseBet}
                    variant="outlined"
                    disabled={disabled}
                >
                    -
                </Button>
                <Typography variant="h6" style={{ margin: '0 20px'}}>
                    $ {betAmount}
                </Typography>
                <Button
                    onClick={increaseBet}
                    variant="outlined"
                    disabled={disabled}
                >
                    +
                </Button>
            </Box>

            <Button
                onClick={handleBet}
                variant="contained"
                disabled={disabled}
            >
                Начать
            </Button>

            {disabled && (
                <Typography variant="h6" style={{ marginTop: '10px' }}>
                    Времени осталось: {remainingTime} секунд
                </Typography>
            )}
        </Stack>
    );
};

export default BetForm;
