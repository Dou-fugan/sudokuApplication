let sudoku;
let woc=0;
self.onmessage = function(e) {
    if(e.data.type==="main"){
        // 调用数独求解
        sudoku=e.data.sudoku;
        backtracking(sudoku);
    }else if(e.data.type==="generate"){
        postMessage({type:"generate","sudoku":generateInit()});
    }
    // console.log(e.data);
};
///////////////////////////////////////////////////
//服务函数
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

////////////////////////////////////////////////////
//生成初盘
var generateInit=()=>{
    let board=[
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    preboard = [
        [1,2,3,4,5,6,7,8,9],
        [4,5,6,7,8,9,1,2,3],
        [7,8,9,1,2,3,4,5,6],
        [2,1,4,3,6,5,8,9,7],
        [3,6,5,8,9,7,2,1,4],
        [8,9,7,2,1,4,3,6,5],
        [5,3,1,6,4,2,9,7,8],
        [6,4,2,9,7,8,5,3,1],
        [9,7,8,5,3,1,6,4,2],
    ];

    for(let i=0;i<9;i++){
        for(let k = 0;k< 9; k++)
        {
            board[i][k] = preboard[i][k];
        }
    }

    let j=[];
    for (let i = 0; i< 12; i++)
    {
        j.push(getRandomInt(0,3))
    }
    for (let i = 0; i < 12; i=i+2)
    {
        if(j[i]===j[i+1]){
            j[i] =( j[i]+1)%3;
        }
    }
    zhongjian = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];
    for (let n = 0, k = 0; n < 6; n = n + 2, k = k + 3)
    {
        for (let m = 0; m < 9; m++)
        {
            zhongjian[j[n] + k][m] = board[j[n] + k][m];
            board[j[n] + k][m] = board[j[n + 1] + k][m];
            board[j[n + 1] + k][m] = zhongjian[j[n] + k][m];
        }
    }
    for (let n = 6, k = 0; n < 12; n = n + 2, k = k + 3)
    {
        for (let m = 0; m < 9; m++)
        {
            zhongjian[m][j[n] + k] = board[m][j[n] + k];
            board[m][j[n] + k] = board[m][j[n + 1] + k];
            board[m][j[n + 1] + k] = zhongjian[m][j[n] + k];
        }
    }
    let count =getRandomInt(20,31);
    // rand() % 11+20;
    for (let i= 0; i < count; )
    {
        let m, n;
        m=getRandomInt(0,9);
        n=getRandomInt(0,9);
        if(board[m][n] !== 0)
        {
            board[m][n] = 0;
            i++;
        }
    }
    return board;
}

////////////////////////////////////////////////////
// 求解数独
function backtracking(board){
    // console.log(board)
    let is_complete=(board)=>{
        for (let i = 0; i < 9; i++)
        {
            for (let k = 0; k < 9; k++)
            {
                if (board[i][k]===0)
                {
                    return false;
                }
            }
        }
        return true;
    }

    let is_possible=(board, i,  j, target)=>{
        //从行和列判断
        for ( let m = 0; m < 9; m++)
        {
            if (board[i][m] === target || board[m][j] === target)
            {
                return false;
            }
        }
        //从3*3的格子判断
        let x = Math.floor(i / 3) * 3, y = Math.floor(j / 3) * 3;
        for (let a=0; a < 3; a++)
        {
            for (let b=0; b < 3; b++)
            {
                if (board[x + a][y + b] === target)
                {
                    return false;
                }
            }
        }
        return true;
    }
    let sudokuStat=[
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
    function solve(board){
        for (let i = 0; i < 9; i++)
        {
            for (let j = 0; j < 9; j++)
            {
                if (board[i][j] === 0)
                {
                    for (let k = 1; k < 10; k++)
                    {
                        for(let m=0;m<9;m++){
                            for(let n=0;n<9;n++){
                                sudokuStat[m][n]=board[m][n];
                            }
                        }
                        sudokuStat[i][j]=k;
                        // post每一个节点（post是在算法运行的过程中post的）
                        postMessage({type:"main","isHaveSolution":1,"sudoku":sudokuStat,"time":0,i:i,j,k:k});
                        // console.log(woc,sudokuStat.flat(2));
                        if (is_possible(board, i, j, k))
                        {
                            board[i][j] = k;
                            solve(board);
                            if (is_complete(board))
                            {
                                return;
                            }
                            board[i][j] = 0;
                        }
                    }
                    return;
                }
            }

        }
    }
    let time1=performance.now();
    solve(board);
    let time2=performance.now();
    if(is_complete(board)){
        postMessage({type:"main","isHaveSolution":1,"sudoku":sudokuStat,"time":0,i:-1,j:-1,k:-1});
    }else {
        postMessage({type:"main","isHaveSolution":0,"sudoku":sudokuStat,"time":time2-time1,i:-1,j:-1,k:-1});
    }
    return board;
}
