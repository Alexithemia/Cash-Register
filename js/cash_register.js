let buffer = '0';
const screen = document.querySelector('.output');
const equals = document.getElementById('equal');
const bal = document.getElementById('balance');
const dep = document.getElementById('deposit');
const out = document.getElementById('withdraw');
const cBtn = document.getElementById('clear');
const backBtn = document.getElementById('back');
let buttons = document.getElementsByClassName('btn');
let itemButtons = document.getElementsByClassName('itemBtn');
let clearReceipt = document.getElementById('cReceipt');
let undoReceipt = document.getElementById('undo');
let payment = document.getElementById('pay')
let balNum = 0;
let keyPressed;
let equaled = 0;
const keyMap = {
    '0': true,
    '.': true,
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
    '8': true,
    '9': true,
    '/': true,
    '*': true,
    '-': true,
    '+': true,
    'x': true
}
const map = {
    '/': true,
    '*': true,
    '-': true,
    '+': true,
    'x': true,
    '÷': true
}
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(event) {
    buttonClick(event.target.innerText);
});
}
for (let i = 0; i < itemButtons.length; i++) {
    itemButtons[i].addEventListener('click', function(event) {
    itemClick(event.target.innerText);
});
}
equals.addEventListener('click', getEqual)
bal.addEventListener('click', getBal);
dep.addEventListener('click', mkDep);
out.addEventListener('click', takeOut);
cBtn.addEventListener('click', empty);
backBtn.addEventListener('click', undo);
clearReceipt.addEventListener('click', clrReceipt);
undoReceipt.addEventListener('click', receiptUndo);
payment.addEventListener('click', mkPayment);

function buttonClick(value){
    value = value.replace(/(\r\n\t|\n|\r\t)/gm,"");
    if(buffer === '0' && !(map[value])){
        buffer = value;
    } else if (map[value] && map[buffer[buffer.length-1]]){
        buffer = buffer.slice(0, -1) + value;
    } else {
        if(equaled === 1 && !(map[value])){
            buffer = value
            equaled = 0;
        } else {
            buffer += value;
            equaled = 0;
        }
    }
    dotPos(value);
    rerender();
}
function rerender(){
    screen.innerText = buffer;
} 
function getEqual(){
    let str = screen.innerText.replace('x','*');
    str = str.replace('÷','/');
    let num = eval(str);
    num = Math.round(100*num)/100;
    buffer = num.toFixed(2);
    equaled = 1;
    rerender();
}
function getBal(){
    screen.innerText = balNum;
    buffer = balNum;
}
function mkDep(){
    getEqual();
    balNum = balNum + parseFloat(screen.innerText);
    getBal();
}
function takeOut(){
    getEqual();
    balNum = balNum - parseFloat(screen.innerText);
    getBal();
}
function empty(){
    if(screen.innerText === '0'){
        balNum = 0;
    }
    screen.innerText = '0'
    buffer = '0';
    equaled = 0;
}
function undo(){
    buffer = buffer.slice(0, -1);
    rerender();
}
document.onkeypress = function (e) {
    keyPressed = String.fromCharCode(e.which);
    if(keyMap[keyPressed]){
        buttonClick(keyPressed);
    } else if(e.keyCode === 13){
        getEqual();
    } else if(keyPressed === 'b'){
        getBal();
    } else if(keyPressed === 'd'){
        mkDep();
    } else if(keyPressed === 'w'){
        takeOut();
    } else if(keyPressed === 'c'){
        empty();
    } else if(keyPressed === 'u'){
        undo();
    } else if(keyPressed === 'p'){
        mkPayment();
    }
}
function itemClick(e){
    let end = 0;
    for (let i = 0; i < e.length; i++) {
        if(e[i] === '$'){
            end = i;
        } 
    }
    if(end === 0){
        end = e.length;
        itemText.innerHTML += '+';
    }
    itemText.innerHTML += e.slice(0, end);
    itemText.innerHTML += '<br>';
    itemPrice.innerHTML += e.slice(end+1, e.length);
    itemPrice.innerHTML += '<br>';
    if(e.slice(end+1, e.length) !== ''){
        let num = eval(totalPrice.innerHTML + '+' + e.slice(end+1, e.length));
        totalPrice.innerHTML = num.toFixed(2);
        screen.innerHTML = totalPrice.innerHTML;
        buffer = totalPrice.innerHTML;
    }
}
function clrReceipt(){
    itemText.innerHTML = '';
    itemPrice.innerHTML = '';
    totalPrice.innerHTML = '0.00';
    buffer = '0';
    screen.innerHTML = '0';
    equaled = 0;
}
function receiptUndo(){
    let eText = itemText.innerHTML;
    let ePrice = itemPrice.innerHTML;
    let end = 0;
    let count = 0;
    let remove = 0;
    for (let i = eText.length-1; i >= 0; i--) {
        if(eText[i] === '>'){
            count++
            if(count === 2){
                end = i+1;
                break;
            }
        } 
        end = 0;
    }
    count = 0;
    itemText.innerHTML = itemText.innerHTML.slice(0, end);
    for (let i = ePrice.length-1; i >= 0; i--) {
        if(ePrice[i] === '>'){
            count++;
            if(count === 2){
                end = i+1;
                break;
            }
        }
        end = 0;
    }
    remove = itemPrice.innerHTML.slice(end, itemPrice.innerHTML.length-4);
    if(remove !== ''){
        let num = eval(totalPrice.innerHTML + '-' + remove);
        totalPrice.innerHTML = num.toFixed(2);
        screen.innerHTML = totalPrice.innerHTML;
        buffer = totalPrice.innerHTML;
    }
    itemPrice.innerHTML = itemPrice.innerHTML.slice(0, end);
}
function dotPos(value){
    // [a.slice(0, position), b, a.slice(position)].join('');
}
function mkPayment(){
    balNum = balNum + parseFloat(screen.innerText);
    buffer += '-';
    rerender();
}