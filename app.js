const express = require("express");
const bodyparser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");


const app = express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
let founditem =[];

//add and workitem array was deleted from here
mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true,useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
  name: String
});

const ite = new mongoose.model("item",itemsSchema);

const ite1 = new ite({
  name: "banana"
});

const ite2 = new ite({
  name: "apple"
});

const ite3 = new ite({
  name: "orange"
});

const defaultitem = [ite1,ite2,ite3];


app.get("/",function(req,res){
  day = date();
  ite.find({},function(err,founditem){
    if (founditem === 0){
      ite.insertMany(defaultitem,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("item inserted succesfully no error found");
        }
      });
      res.redirect("/");
    }else{
    res.render("list",{kindofday:day,item:founditem});
  }
  });
})




app.post("/",function(req,res){
  let data = req.body.newitem;
  const item = new ite({
    name: data
  });
  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkeditemid = req.body.checkbox;
  ite.deleteOne({_id: checkeditemid},function(err){
    if(err){
      console.log(err);
    }  
  });
  res.redirect("/");
});

app.get("/work",function(req,res){
  res.render("list",{kindofday: "Work list",item:workitem});
})

app.post("/work",function(req,res){
  let item = req.body.newitem;
  workitem.push(item);
  res.redirect("/work");
})

app.get("/about",function(req,res){
  res.render("about");
})


app.listen(process.env.PORT||3000,function(){
  console.log("the server has started at the given port");
})
