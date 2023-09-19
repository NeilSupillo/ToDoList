require('dotenv').config()
const express = require("express");
const parser = require("body-parser");
const app = express();
const _ = require("lodash")

const mongoose = require("mongoose");

app.use(parser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const url = process.env.MONGO_URL;
const worklist =[];

mongoose.connect(url,{useNewUrlParser: true})
    .then( ()=> {
        console.log("connected to db")
    })
    .catch( (err)=> {
        console.err(`error connecting to db ${err}`)
    });
    
const todoSchema = new mongoose.Schema({
    todo: String
})


const list = mongoose.model("list", todoSchema);
      
 
     const welcome = new list({
         todo: "Welcome to your to do list."
      });
      const add = new list({
          todo: "Hit the + button to add new item."
      })
      const del = new list({
          todo: "Hit the X to delete item "
      })
    const defaultItem = [welcome, add, del];
    
const customSchema = new mongoose.Schema({
    name: String,
    todo: [todoSchema]
})
const custom = mongoose.model("custom", customSchema);


//dlt()
async function dlt() {
    (await list.deleteMany({todo: "watch tiktok"}))
}

//task.save()

let count = 0
app.post("/task", function (req, res) {
  let reqbol = req.body.check
  if(!reqbol){
    count++
    console.log("plus")
   }else{
     count--
     console.log("minus")
   }
   res.redirect("/")
   
})
app.get("/", function (req, res) {

async function data() {
    const findList = await list.find()
    if(findList.length === 0){
     list.insertMany(defaultItem)
     res.redirect("/");
    }else{
    
   res.render("getday",{listName: "Today", add: findList,roo: "/", toEdit: "", task: findList.length})
  
    }
}
data() 
    
});

app.post("/", function (req, res) {

 const additem = req.body.newitem;
  const saveitem = new list ({
     todo: additem
 })
 
 
saveitem.save()
.then( ()=> {
      res.redirect("/")
   })
});


///delete
app.post("/delete", function (req, res) {

if(req.body.del){
    const delId =(req.body.del);
    const delName =(req.body.name);
     if(delName === "Today"){
    async function del() {
       (await list.findByIdAndRemove({_id: delId}))
    }
    del()
    
 .then( ()=> {
      res.redirect("/")
   })
 }else{
 
 
   async function customDel() {
   await custom.findOneAndUpdate({name: delName},{$pull: {todo: {_id: delId}}})
   
    .then( ()=> {
  res.redirect("/"+ delName)
})
   }
  customDel()
 }
 }
})

app.post("/edit", function (req, res) {
    const delId =(req.body.del);
   const stringToEdit = req.body.stringValue;
     
    async function del() {
       (await list.findByIdAndRemove({_id: delId}))
    }
    del()
    
 .then( ()=> {
  async function data() {
    const findList = await list.find()
 
  
   res.render("getday",{listName: "Today", add: findList,roo: "/", toEdit: stringToEdit, task: findlist.length})
  
    }
    data()
})
 
  })

app.get("/:newtodo", function (req, res) {

const newParam = _.capitalize(req.params.newtodo)

const customDefault = new custom({
    name: newParam,
    todo: defaultItem
})

arrayList()

async function arrayList() {
    const customList = await custom.findOne({name: newParam})
    if(customList){
    
       if(customList.todo.length === 0){
                   
     customList.todo.push(welcome,add,del);
      customList.save()
        /*     .then( ()=> {
     res.redirect("/"+newParam) */
     
     }
    
      res.render("getday",{listName: newParam, add: customList.todo, roo: newParam})
    }else{
    customDefault.save()
   
      .then( ()=> {
    res.redirect("/"+newParam)
    })
  
    }
    
}

    
});

 app.post("/:newt", function (req, res) {
 const addUrl = req.params.newt;    
 const add = req.body.newitem;
 
 const cus = new list({
    todo: add
})

 async function added() {
     const customNewList = await custom.findOne({name: addUrl})
     
     customNewList.todo.push(cus);
     customNewList.save()
     
      .then( ()=> {
     res.redirect("/"+addUrl)
      })
 }
added()
 
}) 


app.get("/about", function (req, res) {
    res.render("about");
});




app.listen(3000, function () {
    console.log("running")
    
})
