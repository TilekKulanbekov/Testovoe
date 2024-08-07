import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateTime } from '../store/slice';

const usePriceUpdate = (betInProgress, remainingTime) => {
    const dispatch = useDispatch();
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (betInProgress && remainingTime > 0) {
            const timeoutId = setTimeout(() => {
                dispatch(updateTime(remainingTime - 1));
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [betInProgress, remainingTime, dispatch]);

    return timeoutRef;
};

export default usePriceUpdate;
