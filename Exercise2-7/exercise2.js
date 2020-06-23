// taking input from the user
var number = window.prompt("Enter how many numbers you want to print");
// console.log(number);

// printing star
for (var i = 0; i < number; i++) {
    var str = "";
    for (var j = 0; j < number - i; j++) {
        str += "* ";
    }
    console.log(str);
}
