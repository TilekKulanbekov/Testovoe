import { useMemo } from 'react';

const useCheckResult = () => {
    const checkResult = useMemo(() => (initial, current, direction) => {

        if (initial === current) return 'draw';
        return (direction === 'up' && current > initial) || (direction === 'down' && current < initial)
            ? 'won'
            : 'lost';
    }, []);

    return checkResult;
};


export default useCheckResult;
