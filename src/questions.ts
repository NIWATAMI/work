import * as board from "./board";

export function q1() {
    const board1 = new board.Board(false);
    console.log(board1.toString());

    const deletables = board1.getDeletables();
    if (deletables.length > 0) {
        console.log('以下の箇所が繋がっています');
        for (const deletable of deletables) {
            console.log(deletable);
        }
    }
    else {
        console.log('繋がっている箇所はありません');
    }
}

export function q2() {
    const board2 = new board.Board(true);
    console.log(board2.toString());
}

export function q3() {
    const board3 = new board.Board(true);
    console.log('以下の盤面が生成されました');
    console.log(board3.toString());

    SwappingCheck(board3, false);
}

export function q4() {
    const board4 = new board.Board(true);
    console.log('以下の盤面が生成されました');
    console.log(board4.toString());

    SwappingCheck(board4, true);
}

function SwappingCheck(boardx: board.Board, checkDiag: boolean = false) {
    const height = boardx.getHeight();
    const width = boardx.getWidth();
    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
            const pos = [i, j];
            const right = [i, j + 1];
            const down = [i + 1, j];
            const diag = [i + 1, j + 1];

            let count = 0;
            // 右と入れ替え
            if (j < width - 1) {
                count += SwappingCheckSub(boardx, [i, j], [i, j + 1]);
            }

            // 下と入れ替え
            if (i < height - 1) {
                count += SwappingCheckSub(boardx, [i, j], [i + 1, j]);
            }

            // 右上と入れ替え
            if (checkDiag && 0 < i && j < width - 1) {
                count += SwappingCheckSub(boardx, [i, j], [i - 1, j + 1]);
            }

            // 右下と入れ替え
            if (checkDiag && i < height - 1 && j < width - 1) {
                count += SwappingCheckSub(boardx, [i, j], [i + 1, j + 1]);
            }
        }
    }
}

function SwappingCheckSub(boardx: board.Board, pos1: number[], pos2: number[]): number {
    const swappedBoard = boardx.swappedBoard(pos1, pos2);
    const deletables = swappedBoard.getDeletables();
    if(deletables.length > 0) {
        console.log(pos1 + 'と' + pos2 + 'を入れ替えると、以下の箇所が繋がります');
        for (const deletable of deletables) {
            console.log(deletable);
        }
    }

    return deletables.length;
}