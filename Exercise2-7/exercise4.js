var fruits = [
    { id: 1, name: "Banana", color: "Yellow" },
    { id: 2, name: "Apple", color: "Red" },
];

function searchByName(arrayName, arrayValue) {
    for (var i = 0; i < arrayName.length; i++) {
        if (arrayName[i].name.toLowerCase() == arrayValue.toLowerCase()) {
            return arrayName[i];
        }
    }
}

function searchByKey(arrayName, arrayKey, arrayValue) {
    for (var i = 0; i < arrayName.length; i++) {
        if (
            arrayName[i][arrayKey].toString().toLowerCase() ==
            arrayValue.toString().toLowerCase()
        ) {
            return arrayName[i];
        }
    }
}

console.log(searchByName(fruits, "apple"));
console.log(searchByKey(fruits, "id", "1"));
console.log(searchByKey(fruits, "id", "2"));
