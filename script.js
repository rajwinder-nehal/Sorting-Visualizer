
let array = [];
let isSorting = false;
let originalArray = [];
let stopSorting = false;
let comparisons = 0;
let operations = 0;

function drawBars(activeIndices = [], sortedIndices = []){
    const container = document.querySelector("#bars-container");
    container.innerHTML = "";
    const max = Math.max(...array);

    array.forEach(function(value, index){
        const bar = document.createElement("div");
        const height = (value/max)*100;
        bar.style.height = height + "%";
        bar.textContent = value;
        bar.classList.add("bar");

        if (activeIndices.includes(index)) {
            bar.classList.add("comparing");
        }

        if (sortedIndices.includes(index)) {
            bar.classList.add("sorted");
        }

        container.appendChild(bar);
    })
}

function generateRandomArray(){
    const size = Number(document.querySelector("#array-size").value);

    comparisons = 0;
    operations = 0;
    updateStats();

    array = [];

    for(let i = 0; i < size; i++){
        array.push(Math.floor(Math.random()*(46)) + 5);
    }
    originalArray = [...array];
    drawBars();
    showArray();
}   

generateRandomArray();

document.querySelector("#new-array").addEventListener("click", generateRandomArray);

function showArray(){
    const display = document.querySelector("#array-items");
    display.textContent = array.join(", ");
}

function swap(i, j){
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    showArray();
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort(){
    let n = array.length;

    for(let i = 0; i < n; i++){
        for(let j = 0; j < n-1-i; j++){
            // highlight bars being compared
            drawBars([j, j+1]);
            await sleep(currentSpeed);
            if (stopSorting) {
                return;
            }

            //compare
            comparisons++;
            updateStats();
            if(array[j] > array[j+1]){
                swap(j, j+1);
                operations++;
                updateStats();
                //update visualization
                drawBars([j, j+1]);
                await sleep(currentSpeed);
                if (stopSorting) {
                    return;
                }                
            }
        }

        //last element marked sorted
        drawBars([], Array.from(
            {length: i+1},
            (_, index) => n-1-index
        ));
    }

    drawBars([], Array.from(
        {length: n},
        (_,index) => index
    ));
}

// algorithm selection
let selectedAlgorithm = null;
const algoSelect = document.querySelector("#algo");
algoSelect.addEventListener("change", function() {
    const selected = algoSelect.value;

    if(selected === "bubble"){
        selectedAlgorithm = bubbleSort;
    }
    else if(selected === "selection"){
        selectedAlgorithm = selectionSort;
    }
    else if(selected === "insertion"){
        selectedAlgorithm = insertionSort;
    }
    else {
        selectedAlgorithm = null;
    }
});

//start sorting button
document.querySelector("#sort").addEventListener("click", async function(){

    if(isSorting){
         return;
    }
    //check if algorithm is selected
    if(!selectedAlgorithm){
        alert("Select an algorithm first");
        return;
    }

    let newArrBtn = document.querySelector("#new-array");
    let arr_size = document.querySelector("#array-size");
    let algo = document.querySelector("#algo");
    let sort = document.querySelector("#sort");

    let disableControls = [newArrBtn, arr_size, algo, sort];

    isSorting = true;
        
        try{
            for(let control of disableControls){
                control.disabled = true;
            }
            stopSorting = false;
            comparisons = 0;
            operations = 0;
            updateStats();
            await selectedAlgorithm();        
        }

        finally{
            
            for(let control of disableControls){
                control.disabled = false;
            }
            isSorting = false;
        }
});

//speed control
let delays = [1000, 500, 100];
let currentSpeed = 500;
const sortSpeed = document.querySelector("#speed");
sortSpeed.addEventListener("input", function(){
    const speed = Number(sortSpeed.value);
     currentSpeed = delays[speed];
});

document.querySelector("#reset").addEventListener("click", () => {
    comparisons = 0;
    operations = 0;
    updateStats();
    stopSorting = true;
    array = [...originalArray];
    drawBars();
    showArray();
});

//selection sort
async function selectionSort(){
    let n = array.length;
    let minIndex = 0;

    for(let i = 0; i < n-1; i++){
        minIndex = i;
        for(let j = i+1; j<n; j++){
            drawBars([minIndex, j]);
            await sleep(currentSpeed);
            if (stopSorting) {
                return;
            }

            comparisons++;
            updateStats();
            if(array[minIndex] > array[j]){
                minIndex = j;
            }
        }
        
        if(minIndex !== i){
            swap(i, minIndex);
            operations++;
            updateStats();
        }
        drawBars([i, minIndex]);
        showArray();
        await sleep(currentSpeed);
        if (stopSorting) {
            return;
        }
    }
    drawBars([], Array.from(
        { length: n },
        (_, index) => index));

    showArray();
}

async function insertionSort(){
    let n = array.length;

    for(let i=1; i<n; i++){
        let key = array[i];
        let prev = i-1;

        while(prev >= 0){
            comparisons++;
            updateStats();

            if(array[prev] <= key){
                break;
            }

            array[prev + 1] = array[prev];                 
            operations++;
            updateStats();
            drawBars([prev, prev + 1]);
            showArray();
            await sleep(currentSpeed);
            if (stopSorting) {
                return;
            }
            prev--;
        }

        array[prev + 1] = key;
        drawBars([prev + 1]);
        showArray();
        await sleep(currentSpeed);
        if(stopSorting){
            return;
        }
    }
    drawBars([], Array.from(
        { length: n },
        (_, index) => index
    ));

    showArray();
}

function updateStats(){
    const comparison = document.querySelector("#comparisons");
    comparison.textContent = comparisons;

    const operation = document.querySelector("#operations");
    operation.textContent = operations;

}
