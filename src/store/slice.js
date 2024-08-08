import { createSlice } from '@reduxjs/toolkit';

const betSlice = createSlice({
    name: 'bet',
    initialState: {
        balance: 1000,
        betHistory: JSON.parse(localStorage.getItem('betHistory')) || [],
        currentPrice: 0,
        betInProgress: false,
        modalOpen: false,
        currentBet: null,
        remainingTime: 0,
        profitLoss: 0
    },
    reducers: {
        startBet(state, action) {
            state.balance -= action.payload.amount;
            state.betInProgress = true;
            state.remainingTime = 30;
        },
        endBet(state, action) {
            state.balance = action.payload.newBalance;
            state.profitLoss = action.payload.profitLossAmount;
            state.betHistory.push(action.payload.newBet);
            state.currentBet = action.payload.currentBet;
            state.modalOpen = true;
            state.betInProgress = false;
            state.remainingTime = 0;
            localStorage.setItem('betHistory', JSON.stringify(state.betHistory));
        },
        closeModal(state) {
            state.modalOpen = false;
            state.currentBet = null;
        },
        updatePrice(state, action) {
            state.currentPrice = action.payload;
        },
        updateTime(state, action) {
            state.remainingTime = action.payload;
        },
        addBetToHistory(state, action) {
            localStorage.setItem('betHistory', JSON.stringify(state.betHistory));
        },
        clearBetHistory: (state) => {
            state.betHistory = [];
            localStorage.removeItem('betHistory');
        },
    }
});

export const { startBet, endBet, closeModal, updatePrice, updateTime, addBetToHistory, clearBetHistory  } = betSlice.actions;

export default betSlice.reducer;
