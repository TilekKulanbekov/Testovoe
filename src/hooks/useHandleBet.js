import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { endBet, startBet } from '../store/slice.js';
import useCheckResult from './useCheckResult';

const useHandleBet = () => {
    const dispatch = useDispatch();
    const checkResult = useCheckResult();

    return useCallback((amount, direction, currentPriceRef, balance, timeoutRef, betInProgress) => {
        if (betInProgress) return;

        const startPrice = currentPriceRef.current;
        dispatch(startBet({ amount }));

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
                newBalance += profitLossAmount;
            } else if (result === 'lost') {
                profitLossAmount = -amount;
                newBalance += profitLossAmount;
            }

            const newBet = { amount, direction, price: startPrice, endPrice, result };
            const currentBet = { amount, direction, price: startPrice, endPrice, result };

            dispatch(endBet({
                newBalance,
                profitLossAmount,
                newBet,
                currentBet
            }));
        }, 30000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dispatch, checkResult]);
};

export default useHandleBet;
