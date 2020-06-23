var myself = {
    name: "sandesh sukubhattu",
    address: "bhaktapur",
    emails: ["sukubhattusandesh8@gmail.com", "sandesh.sukubhattu@ku.edu.np"],
    interests: ["interest1", "interest2"],
    education: [
        {
            name: "ABC School of Schoolery",
            date: 2000,
        },
        {
            name: "BCD School of Trickery",
            date: 2006,
        },
    ],
};

for (var i = 0; i < myself.education.length; i++) {
    console.log(
        "Name: " + myself.education[i].name,
        "Date: " + myself.education[i].date
    );
}
