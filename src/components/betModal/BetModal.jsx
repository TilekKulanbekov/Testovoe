import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Howl } from 'howler';
import './BetModal.css';
import drawImage from '../../assets/draw.png';


Modal.setAppElement('#root');

const BetModal = ({ isOpen, currentBet, onRequestClose }) => {
    const winSound = useRef(
        new Howl({
            src: ['/sounds/won.mp3'],
            volume: 0.5,
        })
    );

    const loseSound = useRef(
        new Howl({
            src: ['/sounds/fail.mp3'],
            volume: 0.5,
        })
    );

    const drawSound = useRef(
        new Howl({
            src: ['/sounds/draw.mp3'],
            volume: 0.5,
        })
    );

    useEffect(() => {
        if (currentBet) {
            if (currentBet.result === 'won') {
                console.log('Playing win sound with Howler...');
                winSound.current.play();
            } else if (currentBet.result === 'lost') {
                console.log('Playing lose sound with Howler...');
                loseSound.current.play();
            } else if (currentBet.result === 'draw') {
                console.log('Playing draw sound with Howler...');
                drawSound.current.play();
            }
        }
    }, [currentBet]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <h2 className="modal-title">Результат ставки</h2>

            {currentBet ? (
                <div className="modal-content">
                    <p>Начальная цена: $ {currentBet.price?.toFixed(2) || 'N/A'}</p>
                    <p>Конечная цена: $ {currentBet.endPrice?.toFixed(2) || 'N/A'}</p>
                    <h1 className={`result ${currentBet.result}`}>
                        {currentBet.result === 'won' ? 'Вы выиграли!' : currentBet.result === 'lost' ? 'Вы проиграли!' : 'Ничья!'}
                    </h1>
                    {currentBet.result === 'won' && (
                        <div className="fireworks-animation">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div key={index} className="fireworks"></div>
                            ))}
                        </div>
                    )}
                    {currentBet.result === 'draw' && (
                        <div>
                            <img className="draw-image" src={drawImage} alt="Draw" />
                        </div>
                    )}
                </div>
            ) : (
                <p>Результат ставки не доступен.</p>
            )}

            <button className="modal-close" onClick={onRequestClose}>Закрыть</button>
        </Modal>
    );
};

export default BetModal;
