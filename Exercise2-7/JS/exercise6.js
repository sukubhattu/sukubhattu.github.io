var arr = [
    {
        id: 1,
        name: "John",
    },
    {
        id: 2,
        name: "Mary",
    },
    {
        id: 3,
        name: "Andrew",
    },
];

function sortBy(array, key) {
    newArr = arr.slice();
    newArr.sort(function (a, b) {
        return a[key] < b[key];
    });
    return newArr;
}

var sorted = sortBy(arr, "name");

console.log(sorted);
