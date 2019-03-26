import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components";
import "antd/dist/antd.css";

import { Input, InputNumber, Button } from 'antd';
import Graph from "./Graph";

const Title = styled.h2`
    
`

const Inputs = styled.div`
    margin: 10px;
    display: flex;
`
const Control = styled.div`
    width: 200px;
    margin: 15px;
    display: flex;
`

const Label = styled.span`
    margin: 7px;
    min-width: 100px;
    font-weight: bold;
`

const LongControl = styled(Control)`
    width: 100%;
`

const PreviewControls = styled.div`
    margin: 20px;
    display: flex;
`

const Sequence = styled.div`
    font-size: 10px;
    font-weight: bold;
    display: flex;
    flex-wrap: wrap;
`

const Element = styled.div`
    background: ${p => p.isInWidnow ? 'rgba(0,0,255,0.2)' : 'white'};
    padding: 2px;
`

const App = () => {
    const [n, setN] = useState(4);
    const [m, setM] = useState(3);
    const [k, setK] = useState(2);
    const [speed, setSpeed] = useState(1000);
    const [playing, setPlaying] = useState(false);
    const [playId, setPlayId] = useState(null);

    const [sequence, setSequence] = useState("[0,0] [1,0] [0,0] [0,1] [0,0] [3,0] [0,0] [0,2] [3,0] [2,0] [2,1] [3,0]");
    const [isVisualizationDisplayed, setIsVisualizationDisplayed] = useState(false);
    const [sequenceElements, setSequenceElements] = useState([]);
    const [windowOffset, setWindowOffset] = useState(0);

    const [v, setV] = useState(0);

    useEffect(() => {
        managePlayer();
    }, [playing])

    useEffect(() => {
        limitPlayer(windowOffset);
    }, [windowOffset])

    return (
        <div style={{ margin: 20 }}>
            <Title>TAIO VISUALIZER</Title>
            {
                !isVisualizationDisplayed && <React.Fragment>
                    <Inputs>
                        <Control>
                            <Label>n (width): </Label><InputNumber min={1} type="number" value={n} onChange={(e) => setN(e)} />
                        </Control>
                        <Control>
                            <Label>m (height): </Label><InputNumber min={1} type="number" value={m} onChange={(e) => setM(e)} />
                        </Control>
                        <Control>
                            <Label>k (window): </Label><InputNumber min={1} type="number" value={k} onChange={(e) => setK(e)} />
                        </Control>
                    </Inputs>

                    <LongControl>
                        <Label>Sequence</Label><Input value={sequence} onChange={(e) => setSequence(e.currentTarget.value)} />
                    </LongControl>
                    <Button type="primary" onClick={generateVisualization} style={{ background: "#1b1b1b", borderColor: "#1b1b1b" }} >Generate Visualization</Button>
                </React.Fragment>
            }
            {
                isVisualizationDisplayed && <React.Fragment >
                    <Button type="primary" style={{ margin: '10px', background: "#1b1b1b", borderColor: "#1b1b1b" }} onClick={newVisualization} icon="redo">New Visualization</Button>
                    <PreviewControls>
                        <Button type="primary" style={{ margin: '10px' }} onClick={stepForward} icon="step-forward">Next</Button>
                        {
                            !playId && <Button type="primary" style={{ margin: '10px', background: "#388e3c", borderColor: "#388e3c", }} icon="play-circle" onClick={play}>Play</Button>
                        }
                        {
                            playId && <Button type="primary" style={{ margin: '10px', background: "#c62828", borderColor: "#c62828" }} onClick={stop} icon="pause" >Pause</Button>
                        }
                        <Button type="primary" style={{ margin: '10px', background: "#ff8f00", borderColor: "#ff8f00" }} onClick={reset} icon="arrow-left">Reset</Button>
                        <Control>
                            <Label>speed: </Label><InputNumber min={1} type="number" style={{ minWidth: 120 }} value={speed} onChange={(e) => setSpeed(e)} /> <Label> [ms]</Label>
                        </Control>
                    </PreviewControls>

                    <Sequence>{sequenceElements.map((element, elementNumber) => <Element isInWidnow={isElementInWindow(elementNumber)}>{element}</Element>
                    )}</Sequence>

                    <Graph n={n} m={m} currentVertices={getElementsFromWindow()} key={v} />
                </React.Fragment>
            }
        </div >
    )

    function getElementsFromWindow() {
        const currentElements = sequenceElements.slice(windowOffset, windowOffset + k);
        const elementObjects = currentElements.map(e => str2Elem(e));
        return elementObjects;
    }

    function str2Elem(str) {
        const [x, y] = str.slice(1).slice(0, -1).split(',')
        return { x: Number(x), y: Number(y) };
    }

    function isElementInWindow(elementNumber) {
        if (elementNumber >= windowOffset && elementNumber < windowOffset + k) {
            return true;
        }
        return false;
    }

    function stepForward() {
        if (windowOffset < sequenceElements.length - k) {
            setWindowOffset(windowOffset => windowOffset + 1);
        }

    }

    function play() {
        if (windowOffset === sequenceElements.length - k) {
            setWindowOffset(0);
        }
        setPlaying(true);
    }

    function reset() {
        stop();
        setWindowOffset(0);
        setV(v => v + 1);
    }

    function managePlayer() {
        if (playing) {
            const playId = setInterval(() => {
                stepForward();
            }, speed);
            setPlayId(playId);
        }
        else {
            clearInterval(playId);
            setPlayId(null);
        }
    }

    function limitPlayer(windowOffset) {
        if (windowOffset === sequenceElements.length - k) {
            stop();
            clearInterval(playId);
            setPlayId(null);
        }
    }

    function stop() {
        setPlaying(false);
    }

    function newVisualization() {
        setIsVisualizationDisplayed(false);
        reset();
    }

    function generateVisualization() {
        setIsVisualizationDisplayed(true);
        const elements = sequence.split(" ");
        setSequenceElements(elements);
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

