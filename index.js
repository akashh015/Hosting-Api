const express = require('express');
const app = express();
const fs = require('fs');
const users = require('./data.json');
const PORT = 8000 ;

app.use(express.urlencoded({extended : false}));

app.get("/api/users" , (req,res) => {
    res.json(users);
});

app.get("/users" , (req,res) => {
    
  const html = `
  <ul>
   ${users.map(users => `<li>${users.first_name}</li>`).join("")}
  </ul>
  `
  res.send(html);
});

app.route("/api/users/:id").
get( (req,res) => {
    const id = Number(req.params.id) ;
    const user = users.find(users => users.id === id)
    if (user) {
        res.json(user);
      } else {
        res.status(404).json({ status: "error", message: "User not found" });
      }
}).delete((req,res) => {

    const id = Number(req.params.id);

    // Filter out the user with the given id
    const filteredUsers = users.filter(user => user.id !== id);

    if (filteredUsers.length < users.length) {
      // Save the filtered users to the file
      fs.writeFile("./data.json", JSON.stringify(filteredUsers), (err, data) => {
        res.json({ status: "success", message: "User deleted", id: id });
      });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
})

app.post("/api/users" , (req,res) => {
    const body = req.body ;
    users.push({...body , id : users.length + 1});
    fs.writeFile("./data.json" , JSON.stringify(users) , (err,data) => {
        res.json({"status" : "success" , id : users.length});
    })
})

app.listen(PORT , () => {
    console.log("Listening from this side");
})