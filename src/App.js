import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

const gif = {
    top: "50%",
    left: "50%",
    position: "absolute",
    display: "inline-block",
    transform: "translate(-50%,-50%)"
};

function App() {
    let colors = ["red", "green", "blue", "yellow", "turquoise", "pink", "purple", "peru"];
    const [gameState, setGameState] = useState({
        cards: {},
        list: []
    });
    const [showWin, setShowWin] = useState(false);
    const [gameCount, setGameCount] = useState({
        found: 0,
        left: 0
    });
    let gameTypes = ["4*4", "8*8"];
    const [selectedGameType, setSelectedGameType] = useState('4*4')
    useEffect(() => {
        initRandColors();
    }, [])

    const initRandColors = () => {
        let cards = {};
        let copyArrColors = colors.slice().concat(colors.slice());//to copy colors and select random colors
        let r, c;
        let arrR = [];
        for (let i = 0; i < copyArrColors.length; i++) {
            arrR.push(i);
        }
        while (Object.keys(cards).length !== colors.length * 2) {
            r = Math.floor(Math.random() * arrR.length);
            c = Math.floor(Math.random() * copyArrColors.length);
            cards[arrR[r] + "-" + copyArrColors[c]] = {
                flipped: false,
                guessed: false
            };
            copyArrColors.splice(c, 1);
            arrR.splice(r, 1);
        }
        setGameState({
            cards,
            list: []
        })
    }

    const handleClick = (color) => {
        const myList = gameState.list;
        if ((myList[0] && color === myList[0]) || gameState.cards[color].guessed) {//check if click on the same square
            return;
        }
        if (myList[1] && color === myList[1]) {//check if click on the same square
            return;
        } else if (myList[0] && myList[1]) {
            if (myList[0].split("-")[1] === myList[1].split("-")[1]) {
                setGameState((state) => ({
                    cards: {
                        ...state.cards,
                        [color]: {
                            flipped: true,
                            guessed: state.cards[color].guessed
                        },
                        [myList[0]]: {
                            flipped: true,
                            guessed: true
                        },
                        [myList[1]]: {
                            flipped: true,
                            guessed: true
                        }
                    },
                    list: [color]
                }));
            } else {
                setGameState((state) => ({
                    cards: {
                        ...state.cards,
                        [color]: {
                            flipped: true,
                            guessed: state.cards[color].guessed
                        },
                        [myList[0]]: {
                            flipped: false,
                            guessed: false
                        },
                        [myList[1]]: {
                            flipped: false,
                            guessed: false
                        }
                    },
                    list: [color]
                }));
            }
        } else {
            setGameState((state) => ({
                cards: {
                    ...state.cards,
                    [color]: {
                        flipped: true,
                        guessed: state.cards[color].guessed
                    }
                },
                list: [
                    ...state.list,
                    color
                ]
            }));
        }
        // need to check if all cards are flipped or not
        isGameOver();
    }

    const isGameOver = () => {
        let flippedCardsCount = 0;
        let allCardsCount = 0;
        let guessedCard = 0;
        Object.keys(gameState.cards).forEach((color) => {
            allCardsCount++;
            if (gameState.cards[color].flipped) {
                flippedCardsCount++;
            }
            if (gameState.cards[color].guessed) {
                guessedCard++;
            }
        })
        if (flippedCardsCount === allCardsCount) {
            setShowWin(true);
        }
        setGameCount({
            found: guessedCard / 2,
            left: colors.length
        })
    }

    const resetGame = () => {
        setGameState({
            cards: {},
            list: []
        });
        setShowWin(false);
        setGameCount({
            found: 0,
            left: colors.length
        })
        initRandColors();
    }

    const Add = gameTypes.map(Add => Add);

    const handleGameTypeChange = (e) => {
        colors = gameTypes[e.target.value] === '4*4' ? ["red", "green", "blue", "yellow", "turquoise", "pink", "purple", "peru"] :
            ["red", "green", "blue", "yellow", "turquoise", "pink", "purple", "peru", "Orange", 'Maroon', 'Charcoal',
            'Aquamarine', 'Coral', 'Fuchsia', 'Wheat', 'Lime'];
        setSelectedGameType(gameTypes[e.target.value]);
        resetGame();
    }

    return (
        <div className="App">
            <div className={'btn-container'}>
                <button className={'btn new'} onClick={resetGame}>New Game</button>

                <select
                    onChange={e => handleGameTypeChange(e)}
                    className="browser-default custom-select dropdown">
                    {
                        Add.map((address, key) => <option key={key} value={key}>{address}</option>)
                    }
                </select>

                <button className={'btn reset'} onClick={resetGame}>Reset</button>
            </div>
            <div className={'game-board'}>
                <h4>Found: {gameCount.found.toFixed()}</h4>
                <h4>Left: {gameCount.left - gameCount.found}</h4>
            </div>
            <div className={
                selectedGameType === '4*4' ? 'game-container-one' : 'game-container-two'
            }>
                {
                    showWin && (
                        <div style={gif}>
                            <img src="https://i.gifer.com/23R2.gif" alt="you win"/>
                        </div>
                    )
                }
                {
                    !showWin && (
                        Object.keys(gameState.cards).map((color, i) => {
                            return <div className="square"
                                        key={i}
                                        style={{background: gameState.cards[color].flipped ? color.split("-")[1] : 'grey'}}
                                        onClick={() => {
                                            handleClick(color)
                                        }
                                        }/>
                        })
                    )
                }
            </div>
        </div>
    );
}

export default App;
