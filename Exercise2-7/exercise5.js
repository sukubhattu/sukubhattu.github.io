var numbers = [1, 2, 3, 4];

function transform(collection, tranFunc) {
    newArr = [];
    for (var i = 0; i < collection.length; i++) {
        newArr.push(tranFunc(collection[i]));
    }
    return newArr;
}
function multiply(number) {
    return number * 2;
}
var output = transform(numbers, multiply);

console.log(output);
