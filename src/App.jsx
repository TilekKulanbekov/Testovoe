import React, {useEffect, useRef, useCallback, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BetForm from './components/betForm/BetForm';
import BetHistory from './components/betHistory/BetHistory';
import CurrentPrice from './components/currentPrice/CurrentPrice';
import BetModal from './components/betModal/BetModal';
import PriceChart from './components/priceChart/PriceChart';
import ProfitLossCard from './components/profitLossCard/ProfitLossCard';
import usePriceUpdate from './hooks/usePriceUpdate';
import useHandleBet from './hooks/useHandleBet';
import useCheckResult from './hooks/useCheckResult.js';
import './App.css';
import {Box, Typography} from "@mui/material";
import Balance from "./components/balance/Balance.jsx";
import { closeModal, updatePrice } from "./store/slice.js";
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
    const dispatch = useDispatch();
    const {
        balance,
        betHistory,
        currentPrice,
        betInProgress,
        modalOpen,
        currentBet,
        remainingTime,
        profitLoss
    } = useSelector(state => state.bet);

    const currentPriceRef = useRef(currentPrice);
    const timeoutRef = usePriceUpdate(betInProgress, remainingTime);
    const [betStartPrice, setBetStartPrice] = useState(null);


    useEffect(() => {
        currentPriceRef.current = currentPrice;
    }, [currentPrice]);

    const handleBet = useHandleBet(setBetStartPrice);

    const handlePriceUpdate = useCallback((price) => {
        dispatch(updatePrice(price));
    }, [dispatch]);

    const handleCloseModal = useCallback(() => {
        dispatch(closeModal());
    }, [dispatch]);

    return (
        <div className='app'>
            <div className='wrapper'>
                <div className='chart'>
                    <Typography variant="h4" gutterBottom>
                        Binary Options Simulator
                    </Typography>
                    <CurrentPrice onPriceUpdate={handlePriceUpdate} />
                    <PriceChart />
                    <ErrorBoundary>
                        <BetHistory history={betHistory} />
                    </ErrorBoundary>
                </div>
                <div className='betForm'>
                    <Balance balance={balance} />
                    <Box mb={2}>
                        <Typography className="betStartPrice" variant="h6">Bet Start Price: ${betStartPrice !== null ? betStartPrice.toFixed(2) : 'N/A'}</Typography>
                    </Box>
                    <BetForm
                        balance={balance}
                        onBet={(amount, direction) => {
                            handleBet(amount, direction, currentPriceRef, balance, timeoutRef, betInProgress);
                        }}
                        disabled={betInProgress}
                        remainingTime={remainingTime}
                    />
                    <ProfitLossCard profitLoss={profitLoss} />
                </div>
            </div>
            <BetModal
                isOpen={modalOpen}
                onRequestClose={handleCloseModal}
                currentBet={currentBet}
            />
        </div>
    );
};

export default App;
