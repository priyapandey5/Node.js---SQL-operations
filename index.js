const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "/views"));

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'faker_1',
    password:'Priyacode1#',
  });

  let getRandomUser = () => {
    return [
       faker.data.uuid(),
       faker.internet.userName(),
       faker.internet.email(),
       faker.internet.password(),
       faker.image.avatar(),
       faker.date.birthdate(),
       faker.date.past(),
    ];
  };

  // Using placeholders
  //  let q = "INSERT INTO user (id, username, email, password, avatar_path, birthdate, registeredAt) VALUES ?";

  // let data = [];
  // for(let i=1; i<=100; i++){
  //   data.push(getRandomUser());
  // }
  // let users = [
  //   ["111", "AAApandey", "AAA@gmail.com", "hashed_password1", "avatar_path1", "2002-05-05", "2002-05-05"],
  //   ["555", "BBBpandey", "BBB@gmail.com", "hashed_password2", "avatar_path2", "2000-06-07", "2002-05-05"],
  // ];


  // try{
  // connection.query(q,[data], (err,result) => {
  //     if(err) throw err;
  //     console.log(result); // results contains rows returned by server
  //   });
  //   }catch(err){
  //     console.log(err);
  //   }
  //     //console.log(fields); // fields contains extra meta data about results, if available
  //  connection.end();

  
  //console.log(getRandomUser());

  //get will fetch and show 
  app.get("/" , (req, res) => {
    //res.send("welcome");
    let q = `SELECT count(*) FROM user`;
    try{
      connection.query(q, (err,result) => {
          if(err) throw err;
         let count = result[0]["count(*)"];
         console.log(result); // results contains rows returned by server
         // res.send(result);
          //res.send(result[0]);
          res.render("home.ejs",{count});
          
        });
        }catch(err){
          console.log(err);
          res.send("some err in db");
        }
  });

  // HOME 
  app.get("/user" , (req,res) => {
    let q = `SELECT * FROM user`;
    try{
      connection.query(q,(err, users) => {
        if(err) throw err;
       // console.log(users);
        //res.send(users);
        res.render("showusers.ejs",{users});
      });
    }catch(err) {
      console.log(err);
      res.send("some err in db");
    }
  });


  //EDIT ROUTE
 app.get("/user/:id/edit",(req,res) =>{
  let {id} = req.params;
  let q = ` SELECT * FROM user WHERE id = '${id}'`; // to edit only that which you want
  //console.log(id);
  //res.render("edit.ejs");
  try{
    connection.query(q,(err,result) => {
      if(err) throw err;
     // console.log(result); // isse ek array me result aata jise hm ejs me nahi dalte
     let user = result[0]; // isse object me result aata hai array ka 0t elemnt jise m ejs me dal sakte hai
     console.log("edited");
     res.render("edit.ejs",{user});
    });
  }catch(err){
    console.log(err);
    res.send("some err in db");
  }
 });

 //update
 app.patch("/user/:id" , (req,res) => {
  //res.send("updated");
  let {id} = req.params;
  let {password:formPass, username:newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err,result) => {
      if(err) throw err;
     // console.log(result); // isse ek array me result aata jise hm ejs me nahi dalte
     let user = result[0]; // isse object me result aata hai array ka 0t elemnt jise m ejs me dal sakte hai
     console.log(user);
     if(formPass != user.password){
        res.send("wrong Password");
      }else{
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err,result) => {
          if(err) throw err;
          //res.send(result);
          res.redirect("/user");
        });
      }
    });
     }catch(err){
    console.log(err);
    res.send("some err in db");
  }
 });

 //TO CREATE
app.get("/user/new" , (req,res) => {
  res.render("newUser.ejs");
});

app.post("/user/new",(req,res) => {
  let { username,email,password,avatar_path,birthdate,registeredAt} = req.body;
  let id =  uuidv4();
  let q = `INSERT INTO user (id, username, email, password, avatar_path, birthdate, registeredAt)
           VALUES ('${id}','${username}','${email}','${password}','${avatar_path}','${birthdate}','${registeredAt}')`;
         try {
            connection.query(q, (err, result) => {
              if (err) throw err;
              console.log("added new user");
              res.redirect("/user");
            });
          } catch (err) {
            res.send("some error with DB");
          }
});


//TO Delete
 app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

 //delete
 app.delete("/user/:id/",(req,res) => {
  let {id} = req.params;
  let {password} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
    connection.query(q,(err,result) => {
      if(err)throw err;
      //console.log(result);
      let user = result[0];
      //console.log(user);
      if(user.password != password){
        res.send("wrong password or email");
      }else{
        let q2 = `DELETE FROM user WHERE id = '${id}'`;
        connection.query(q2, (err,result) => {

          
          if(err) throw err;
          console.log(result);
            console.log("deleted!");
            res.redirect("/user");
        });
      }
    });
  }catch(err){
    console.log(err);
    res.send("some err in db");
  }
 });

  app.listen("8080" , () => {
    console.log("server is listining");
  });