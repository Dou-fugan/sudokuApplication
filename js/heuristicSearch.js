var heuristicSearch=()=>{
    return "heuristicSearch";
}

self.onmessage = function(e) {
    if(e.data.type==="main"){
        // console.log(buckets);
        wt_cre();
        DFS(1);
        console.log(num);
    }
    // console.log(e.data);
};

function compare(a, b) {
    // a<b
    if (a[0]<b[0]) {
        return -1;
    }else if (a[0]===b[0]) {
        if(a[1]<b[0]){
            return -1;
        }else if(a[1]===b[1]){
            return 0
        }
    }else {
        return 1;
    }
}

var buckets = require('buckets-js');
var q=buckets.PriorityQueue(compare);
var sign=false;
var num=[
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
]
var idx;
function Check(n,key)
{
    /* 判断n所在横列是否合法 */
    for (let i = 0; i < 9; i++)
    {
        /* j为n竖坐标 */
        let j = Math.floor(n / 9);
        if (num[j][i] === key) return false;
    }

    /* 判断n所在竖列是否合法 */
    for (let i = 0; i < 9; i++)
    {
        /* j为n横坐标 */
        let j = n % 9;
        if (num[i][j] === key) return false;
    }

    /* x为n所在的小九宫格左顶点竖坐标 */
    let x = Math.floor(Math.floor(n / 9) / 3) * 3;

    /* y为n所在的小九宫格左顶点横坐标 */
    let y = Math.floor(n % 9 / 3) * 3;

    /* 判断n所在的小九宫格是否合法 */
    for (let i = x; i < x + 3; i++)
    {
        for (let j = y; j < y + 3; j++)
        {
            if (num[i][j] === key) return false;
        }
    }
    /* 全部合法，返回正确 */
    return true;
}

function wt_cre()
{
    idx=0;
    for (let n=0; n<=80; n++)
    if (!num[Math.floor(n/9)][n%9])
    {
        idx++;
        let ans=0;
        for (let i=0; i<9; i++)
        {
            let j=Math.floor(n/9);
            if (num[j][i]) ans++;
        }
        for (let i=0; i<9; i++)
        {
            let j=n%9;
            if (num[i][j]) ans++;
        }
        let x= Math.floor(Math.floor(n/9)/3)*3;
        let y= Math.floor(n%9/3)*3;
        for (let i = x; i < x + 3; i++)
        for (let i=x; i<x+3; i++)
        {
            for (let j=y; j<y+3; j++)
            {
                if (num[i][j]) ans++;
            }
        }
        q.add([ans,n]);
    }
}

function DFS(n)
{
    if (n>idx)
    {
        sign=true;
        return ;
    }
    let t = q.peek();
    q.dequeue();
    let x=t[1];
    for (let i=1; i<=9; i++)
    {
        if (Check(x,i))

        {
            num[Math.floor(x/9)][x%9]=i;
            DFS(n+1);
            if (sign) return ;

        }
    }
    num[Math.floor(x/9)][x%9]=0;  //返回原值
    q.add(t);
}
