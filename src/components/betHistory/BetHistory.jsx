import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Button, Modal } from '@mui/material';
import './BetHistory.css';
import { LuHistory } from "react-icons/lu";

const BetHistory = ({ history }) => {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <Box mb={2}>
            <Typography variant="h6">Bet History</Typography>
            <div className='wrapper'>
                <List>
                    {history.slice(0, 2).map((bet, index) => (
                        <ListItem key={index} className='list'>
                            <ListItemText
                                primary={`Bet $${bet.amount} on ${bet.direction.toUpperCase()} at $${bet.price.toFixed(2)}`}
                                secondary={`Result: ${bet.result}, Start Price: $${bet.price.toFixed(2)}, End Price: $${bet.endPrice.toFixed(2)}`}
                            />
                        </ListItem>
                    ))}
                </List>
                {history.length > 2 && (
                    <Button
                        style={{color: 'white'}}
                        variant="text"
                        onClick={() => setShowModal(true)}
                        endIcon={<LuHistory />}
                    >
                        See More
                    </Button>
                )}
            </div>

            <Modal open={showModal} onClose={handleClose}>
                <Box className="modal">
                    <Typography variant="h6" className="modal-title">History</Typography>
                    <List>
                        {history.map((bet, index) => (
                            <ListItem key={index} className='list'>
                                <ListItemText
                                    primary={`Bet $${bet.amount} on ${bet.direction.toUpperCase()} at $${bet.price.toFixed(2)}`}
                                    secondary={`Result: ${bet.result}, Start Price: $${bet.price.toFixed(2)}, End Price: $${bet.endPrice.toFixed(2)}`}
                                />
                            </ListItem>
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

