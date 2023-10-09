import { randomBytes } from "crypto";
import * as util from "./util";

export class Board {
    protected BOARD_WIDTH = 6;
    protected BOARD_HEIGHT = 5;
    protected MINIMUM_DELETABLE = 3;

    protected board: number[][];

    constructor(undeletable: boolean, initial: number[][] = []) {
        if (initial.length === 0) {
            this.board = this.CreateRandomBoard();
            if (undeletable) {
                this.RemoveDeletables();
            }
        }
        else {
            this.board = initial;
            this.BOARD_HEIGHT = initial.length;
            this.BOARD_WIDTH = initial[0].length;
        }
    }

    // []を外して出力用に整形する
    public toString(): string {
        let ret: string = '';
        for(let i = 0; i < this.BOARD_HEIGHT; ++i)
        {
            for(let j = 0; j < this.BOARD_WIDTH; ++j)
            {
                ret += (this.board[i][j].toString() + ' ');
            }
            ret += '\n';
        }
    
        return ret;
    }

    public getDeletables(): number[][][] {
        return this.SearchDeletables();
    }

    public getHeight(): number {
        return this.BOARD_HEIGHT;
    }

    public getWidth(): number {
        return this.BOARD_WIDTH;
    }

    // 盤面のうち2ヶ所を入れ替え、新しい盤面として返す
    public swappedBoard(pos1: number[], pos2: number[]): Board {
        const swapped: number[][]=[];
        for (const row of this.board) {
            swapped.push([...row]);
        }

        const tmp = swapped[pos1[0]][pos1[1]];
        swapped[pos1[0]][pos1[1]] = swapped[pos2[0]][pos2[1]];
        swapped[pos2[0]][pos2[1]] = tmp;

        return new Board(false, swapped);
    }

    // 乱数で盤面を作成
    private CreateRandomBoard(): number[][] {
        let board: number[][] 
            = Array(this.BOARD_HEIGHT).fill([]).map(_ => Array(this.BOARD_WIDTH).fill(0));
    
            for(let i = 0; i < this.BOARD_HEIGHT; ++i) {
                for(let j = 0; j < this.BOARD_WIDTH; ++j) {
                    board[i][j] = util.rand(1, 6);
                }
            }
        return board;
    }

    // 繋がった部分を変更して繋がった状態を解消する
    private RemoveDeletables() {
        let deletables = this.SearchDeletables();
        while (deletables.length > 0) {
            for (const deletable of deletables) {
                const center: number = Math.floor(deletable.length / 2);
                this.ChangeForUndeletable(deletable[center][0], deletable[center][1]);
            }
            deletables = this.SearchDeletables();
        }
    }

    // 特定の座標の数値を変更
    // 周囲のマスを確認して繋がった状態にならないように変更
    private ChangeForUndeletable(x: number, y: number) {
        const candidates = new Set([1,2,3,4,5,6]);
        if (x > 0) {
            candidates.delete(this.board[x - 1][y]);
        }
        if (x < this.BOARD_HEIGHT - 1) {
            candidates.delete(this.board[x + 1][y]);
        }
        if (y > 0) {
            candidates.delete(this.board[x][y - 1]);
        }
        if (y < this.BOARD_WIDTH - 1) {
            candidates.delete(this.board[x][y + 1]);
        }

        const array = [...candidates];
        this.board[x][y] = array[util.rand(1,array.length) - 1];
    }

    // 繋がっている部分を探索
    private SearchDeletables(): number[][][] {
        const deletables: number[][][] = [];
    
        // 横方向で繋がっているもの
        for (let i = 0; i < this.BOARD_HEIGHT; ++i) {
            for (let j = 0; j < this.BOARD_WIDTH; ++j) {
                const element = this.board[i][j];
                let tmp: number[][] = [];
                tmp.push([i, j]);
                for (let k = j + 1; k < this.BOARD_WIDTH; ++k) {
                    if(this.board[i][k] === element) {
                        tmp.push([i, k]);
                        j = k;
                    }
                    else {
                        break;
                    }
                }
                if (tmp.length >= this.MINIMUM_DELETABLE) {
                    deletables.push(tmp);
                }
            }
        }
    
        // 縦方向で繋がっているもの
        for (let j = 0; j < this.BOARD_WIDTH; ++j) {
            for (let i = 0; i < this.BOARD_HEIGHT; ++i) {
                const element = this.board[i][j];
                let tmp: number[][] = [];
                tmp.push([i, j]);
                for (let k = i + 1; k < this.BOARD_HEIGHT; ++k) {
                    if(this.board[k][j] === element) {
                        tmp.push([k, j]);
                        i = k
                    }
                    else {
                        break;
                    }
                }
                if (tmp.length >= this.MINIMUM_DELETABLE) {
                    deletables.push(tmp);
                }
            }
        }
    
        return deletables;
    }
}