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

function compareSort(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}
newArr = arr.slice();
newArr.sort(compareSort);

console.log(arr);
console.log(newArr);
