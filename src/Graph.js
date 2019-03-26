import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Vertice = styled.div`
    width: 12px;
    height: 12px;
    border: 2px ${p => p.isHelper ? 'dashed lightgray' : 'solid black'};
    margin: 5px;
    border-radius: 50%;
    background: ${p => p.isHelper ? 'white' : p.color};
`

const VerticalEdge = styled.div`
    width: 4px;
    height: 20px;
    border-radius: 4px;
    margin-right: 38px;
    border: 1px solid black;
    background: ${p => p.color};
`

const HorizontalEdge = styled.div`
    width: 20px;
    height: 4px;
    border-radius: 4px;
    border: 1px solid black;
    background: ${p => p.color};
`

const RowContainer = styled.div`
    display: flex;
    align-items: center;
`

const Index = styled.span`
    font-weight: bold;
    width: 20px;
`

function getColor(type) {
    switch (type) {
        case 1:
            return "blue";
        case 2:
            return "green";
        default:
            return "white";
    }
}

const Row = ({ length, rowData, horizontalEdgesData }) => {
    return (
        <RowContainer>
            <Vertice isHelper />
            <HorizontalEdge color={getColor(horizontalEdgesData[length - 1])} />
            {
                Array(length).fill(0).map(
                    (_, i) => <React.Fragment>
                        <Vertice key={`v-${i}`} color={getColor(rowData[i])} />
                        <HorizontalEdge color={getColor(horizontalEdgesData[i])} />
                    </React.Fragment>
                )
            }
            <Vertice isHelper />
        </RowContainer>
    )
}

const HelperRow = ({ length }) => {
    return (
        <RowContainer style={{ marginLeft: '42px' }}>
            {
                Array(length).fill(0).map(
                    (_, i) => <Vertice key={`h-${i}`} isHelper style={{ marginRight: 25 }} />
                )
            }
        </RowContainer>
    )
}

const VerticalEdges = ({ length, verticalEdgesData }) => {
    return (
        <RowContainer style={{ marginLeft: '52px' }}>
            {
                Array(length).fill(0).map(
                    (_, i) => <VerticalEdge key={`ve-${i}`} color={getColor(verticalEdgesData[i])} />
                )
            }
        </RowContainer>
    )
}

const VerticalLegend = ({ length }) => {
    return <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', marginRight: '4px' }}>
        <Index>{length - 1}</Index>
        {
            Array(length).fill(0).map((_, i) => <Index style={{ marginTop: '21px' }}>{i}</Index>)
        }
        <Index style={{ marginTop: '21px' }}>0</Index>
    </div>
}

const HorizontalLegend = ({ length }) => {
    return <div style={{ display: 'flex', marginLeft: 7 }}>
        <Index style={{ marginRight: 22 }}>{length - 1}</Index>
        {
            Array(length).fill(0).map((_, i) => <Index style={{ marginRight: 22 }}>{i}</Index>)
        }
        <Index>0</Index>
    </div>
}

const Graph = ({ n, m, currentVertices }) => {
    const [verticesMatrix, setVerticesMatrix] = useState(getEmptyMatrix(n, m));
    const [verticalEdgesMatrix, setVerticalEdgesMatrix] = useState(getEmptyMatrix(n, m));
    const [horizontalEdgesMatrix, setHorizontalEdgesMatrix] = useState(getEmptyMatrix(n, m));

    useEffect(() => {
        let newHE = markHorizontalEdges();
        let newVE = markVerticalEdges();
        markDoneVertices(newHE, newVE);
    }, [currentVertices])

    function markDoneVertices(he, ve) {
        let cleared = matrixWithChangedCurrent(verticesMatrix, 0);
        currentVertices.forEach(vertice => {
            cleared[vertice.y][vertice.x] = 1;
        })
        let done = cleared.map((row, y) =>
            row.map((cell, x) => {
                const topEdgeDone = y === 0 ? ve[m - 1][x] === 2 : ve[y - 1][x] === 2;
                const bottomEdgeDone = ve[y][x] === 2;
                const leftEdgeDone = x === 0 ? he[y][n - 1] === 2 : he[y][x - 1] === 2;
                const rightEdgeDone = he[y][x] === 2;
                if (topEdgeDone && bottomEdgeDone && leftEdgeDone && rightEdgeDone) {
                    return 2;
                }
                return cell;
            }));
        setVerticesMatrix(done);
    }

    function markHorizontalEdges() {
        let saved = matrixWithChangedCurrent(horizontalEdgesMatrix, 2);
        currentVertices.forEach(vertice => {
            const leftNeighbour = currentVertices.find(v => vertice.x === 0
                ? (v.x === n - 1 && v.y === vertice.y)
                : (v.x === vertice.x - 1 && v.y === vertice.y));
            const rightNeighbour = currentVertices.find(v => vertice.x === n - 1
                ? (v.x === 0 && v.y === vertice.y)
                : (v.x === vertice.x + 1 && v.y === vertice.y));
            if (leftNeighbour) {
                if (saved[vertice.y][vertice.x === 0 ? n - 1 : vertice.x - 1] !== 2) {
                    saved[vertice.y][vertice.x === 0 ? n - 1 : vertice.x - 1] = 1;
                }
            }
            if (rightNeighbour) {
                if (saved[vertice.y][vertice.x] !== 2) {
                    saved[vertice.y][vertice.x] = 1;
                }
            }
        })

        setHorizontalEdgesMatrix(saved);
        return saved;
    }


    function markVerticalEdges() {
        let saved = matrixWithChangedCurrent(verticalEdgesMatrix, 2);
        currentVertices.forEach(vertice => {
            const topNeighbour = currentVertices.find(v => vertice.y === 0
                ? (v.y === m - 1 && v.x === vertice.x)
                : (v.y === vertice.y - 1 && v.x === vertice.x));
            const bottomNeighbour = currentVertices.find(v => vertice.y === m - 1
                ? (v.y === 0 && v.x === vertice.x)
                : (v.y === vertice.y + 1 && v.x === vertice.x));
            if (topNeighbour) {
                if (saved[vertice.y === 0 ? m - 1 : vertice.y - 1][vertice.x] !== 2) {
                    saved[vertice.y === 0 ? m - 1 : vertice.y - 1][vertice.x] = 1;
                }
            }
            if (bottomNeighbour) {
                if (saved[vertice.y][vertice.x] !== 2) {
                    saved[vertice.y][vertice.x] = 1;
                }
            }
        })
        setVerticalEdgesMatrix(saved);
        return saved;
    }

    return (
        <div style={{ marginTop: '10px', display: 'flex' }}>
            <VerticalLegend length={m} />
            <div>
                <HorizontalLegend length={n} />
                <HelperRow length={n} />
                <VerticalEdges length={n} verticalEdgesData={verticalEdgesMatrix[m - 1]} />
                {
                    Array(m).fill(0).map(
                        (_, i) => <React.Fragment >
                            <Row length={n} key={i} rowData={verticesMatrix[i]} horizontalEdgesData={horizontalEdgesMatrix[i]} />
                            {
                                i !== m && <VerticalEdges length={n} verticalEdgesData={verticalEdgesMatrix[i]} />
                            }
                        </React.Fragment>
                    )
                }
                <HelperRow length={n} />
            </div>
        </div>
    )
}

function getEmptyMatrix(n, m) {
    return Array(m).fill(0).map(_ => Array(n).fill(0));
}

function matrixWithChangedCurrent(matrix, changeTo) {
    return matrix.map(
        row => row.map(
            cell => cell === 1 ? changeTo : cell
        )
    )
}

export default Graph;
