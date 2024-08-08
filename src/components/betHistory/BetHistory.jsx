import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, Typography, Box, Button, Modal } from '@mui/material';
import './BetHistory.css';
import { LuHistory } from "react-icons/lu";
import {clearBetHistory} from "../../store/slice.js";

const BetHistory = ({ history }) => {
    const [showModal, setShowModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const dispatch = useDispatch();

    const handleClose = () => {
        setShowModal(false);
    };

    const handleClearHistory = () => {
        dispatch(clearBetHistory());
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Box mb={2} className="betHistory">
            <Typography variant="h6">Bet History</Typography>
            <div className='wrapper'>
                {!isMobile && history.length > 0 && (
                    <List className='history-list'>
                        {history.slice(0, 2).map((bet, index) => (
                            bet && bet.amount !== undefined && bet.direction !== undefined && (
                                <ListItem key={index} className='list'>
                                    <ListItemText
                                        primary={`Bet $${bet.amount} on ${bet.direction.toUpperCase()} at $${(bet.price || 0).toFixed(2)}`}
                                        secondary={`Result: ${bet.result}, Start Price: $${(bet.price || 0).toFixed(2)}, End Price: $${(bet.endPrice || 0).toFixed(2)}`}
                                    />
                                </ListItem>
                            )
                        ))}
                    </List>
                )}
                {(isMobile || history.length > 2) && (
                    <Button
                        style={{color: 'white'}}
                        className='see-more-button'
                        variant="text"
                        onClick={() => setShowModal(true)}
                        endIcon={<LuHistory />}
                    >
                        See More
                    </Button>
                )}
                <Button
                    style={{color: 'white'}}
                    className='clear-history-button'
                    variant="text"
                    onClick={handleClearHistory}
                >
                    Clear History
                </Button>
            </div>

            <Modal open={showModal} onClose={handleClose}>
                <Box className="modal">
                    <Typography variant="h6" className="modal-title">History</Typography>
                    <List>
                        {history.map((bet, index) => (
                            bet && bet.amount !== undefined && bet.direction !== undefined && (
                                <ListItem key={index} className='list'>
                                    <ListItemText
                                        primary={`Bet $${bet.amount} on ${bet.direction.toUpperCase()} at $${(bet.price || 0).toFixed(2)}`}
                                        secondary={`Result: ${bet.result}, Start Price: $${(bet.price || 0).toFixed(2)}, End Price: $${(bet.endPrice || 0).toFixed(2)}`}
                                    />
                                </ListItem>
                            )
                        ))}
                    </List>
                    <Button variant="contained" onClick={handleClose}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default BetHistory;
