import * as questions from "./questions";
import * as util from "./util";
const readline = require('readline');

export const readFromCli = async (message: string, accept?: (input: string) => boolean): Promise<string> => {
    while (true) {
        const ans = await readFromCli2(message);
        if (!accept || accept(ans)) return ans;
    }
};

const readFromCli2 = async (message: string): Promise<string> => {
    const readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise<string>((resolve) => {
        readlineInterface.question(message, (ans: string) => {
            resolve(ans);
            readlineInterface.close();
        });
    });
};

const main = async () => {
    while (true) {
        const answer: string = await readFromCli('1~4の番号を入力してください > ');
        if (answer === '1') {
            questions.q1();
        }
        else if (answer === '2') {
            questions.q2();
        }
        else if (answer === '3') {
            questions.q3();
        }
        else if (answer === '4') {
            questions.q4();
        }
        else {
            await readFromCli('終了します。Enterを押してください。');
            break;
        }
        console.log('');
    }
};

// 起動
(async () => {
    await main();
})();
