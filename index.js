var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// for template library
app.set("view engine", 'ejs');
// for accessing public folder data without die structure(like ../public/foldername/filename )
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true });
const itemSchema = {
    name: String
}
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
    name: 'food'
});
const item2 = new Item({
    name: 'gen'
});

const d = [item1, item2];


app.get("/", (req, res) => {
    Item.find({}, (err, arr) => {
        if(arr.length === 0){
            Item.insertMany(d, (err)=> {
                if(err){
                    console.log(err)
                }else {
                    console.log("successfully saved item to db");
                }
            })
            res.redirect("/");
        } else{
            // render ejs list template
            res.render("list", {newListItems : arr})
        }
    })
})

app.post("/", (req, res) => {
    const itemName = req.body.n;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
})

// Delete Item
app.post("/delete", (req, res) => {
    const check = req.body.checkbox;
    Item.findByIdAndRemove(check, err => {
        if(!err){
            console.log("successfully deleted");
            res.redirect("/");
        }
    })
})

app.listen(3000, (res) => {
    console.log("Server is Listening to port 3000");
})