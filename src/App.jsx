import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { updatePrice, closeModal } from './store/slice';
import Balance from './components/balance/Balance';
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

    useEffect(() => {
        currentPriceRef.current = currentPrice;
    }, [currentPrice]);

    const checkResult = useCheckResult();
    const handleBet = useHandleBet(checkResult);

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
                    <BetHistory history={betHistory} />
                </div>
                <div className='betForm'>
                    <Balance balance={balance} />
                    <BetForm
                        balance={balance}
                        onBet={(amount, direction) => handleBet(amount, direction, currentPriceRef, balance, timeoutRef, betInProgress)}
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
