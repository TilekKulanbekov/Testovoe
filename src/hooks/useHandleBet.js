import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addBetToHistory, endBet, startBet } from '../store/slice.js';
import useCheckResult from './useCheckResult';

const useHandleBet = (setBetStartPrice) => {
    const dispatch = useDispatch();
    const checkResult = useCheckResult();

    return useCallback((amount, direction, currentPriceRef, balance, timeoutRef, betInProgress) => {
        if (betInProgress) return;

        const startPrice = currentPriceRef.current;
        setBetStartPrice(startPrice);
        dispatch(startBet({ amount }));

        const bet = { amount, direction, price: startPrice };

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const endPrice = currentPriceRef.current;
            const result = checkResult(startPrice, endPrice, direction);

            let profitLossAmount = 0;
            let newBalance = balance;

            if (result === 'won') {
                profitLossAmount = amount;
                newBalance += profitLossAmount;
            } else if (result === 'draw') {
                profitLossAmount = 0;
            } else if (result === 'lost') {
                profitLossAmount = -amount;
                newBalance += profitLossAmount;
            }

            const currentBet = { amount, direction, price: startPrice, endPrice, result };

            dispatch(endBet({
                newBalance,
                profitLossAmount,
                newBet: { ...bet, result, endPrice },
                currentBet
            }));

            dispatch(addBetToHistory({ ...bet, result, endPrice }));
        }, 1000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dispatch, checkResult, setBetStartPrice]);
};

export default useHandleBet;
