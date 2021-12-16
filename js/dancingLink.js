self.onmessage = function(e) {
    if(e.data.type==="main"){
        console.log(e);
        // postMessage({type:"main","sudoku":});
    }
};