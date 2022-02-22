const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + "/date.js")
var $ = require("jquery");
const app = express()
const mongoose = require("mongoose");
const _ = require("lodash");

const day = date.getDate();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://vansh_7071:jZkUwBCptg9JFA4@cluster0.oomzj.mongodb.net/todoDB", {
    useNewUrlParser: true
});

const itemSchema = {
    name: String
};

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
    name: "Do Coding tonight"
});

const item2 = new Item({
    name: "Do exercise"
});

const item3 = new Item({
    name: "Brainstorm"
});


const listSchema = {
    name: String,
    items: [itemSchema]
};
const ourItems = [item1, item2, item3];
const List = mongoose.model("list", listSchema);

app.get('/', function (req, res) {


    Item.find({}, function (error, itemsfound) {

        if (itemsfound.length === 0) {

            Item.insertMany(ourItems, function (error) {
                if (error)
                    console.log(error);

                else {
                    console.log("successfully added items");
                }
            });
            res.redirect("/");
        } else {
            if (error) console.log(error);
            else {
                res.render('list', {
                    listTitle: day,
                    newlistItems: itemsfound
                });
            }
        }
    });

});

app.post('/', function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const itemNew = new Item({
        name: itemName
    });

    if (listName === day) {
        itemNew.save();

        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, function (error, foundList) {

            foundList.items.push(itemNew);
            foundList.save();
            res.redirect("/" + listName);

        })
    }
});



app.post("/reset", function (req, res) {
    mongoose.connection.db.dropDatabase(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("database deleted");
        }
    });

    res.redirect("/");
});

app.post("/delete", function (req, res) {
    const itemRmId = req.body.checkbox;
    const rmList = req.body.listName;

    if (rmList === date) {
        Item.findByIdAndRemove(itemRmId, function (error) {

            if (error) {
                console.log(error);
            } else {
                console.log("successfully deleted one item");
            }

        });

        res.redirect("/");
    } else {
        List.findOneAndUpdate({
            name: rmList
        }, {
            $pull: {
                items: {
                    _id: itemRmId
                }
            }
        }, function (error, foundList) {
            if (!error) {
                res.redirect("/" + rmList);
            }
        })
    }

});

app.get("/:customName", function (req, res) {

    const customName = _.capitalize(req.params.customName);

    List.findOne({
        name: customName
    }, function (error, foundList) {
        if (!error) {
            if (!foundList) {
                //create a list
                console.log("exist");
                const listnew = new List({
                    name: customName,
                    items: ourItems
                });
                listnew.save();
                res.redirect("/" + customName);
            } else {

                res.render('list', {
                    listTitle: customName,
                    newlistItems: foundList.items
                });
            }

        }
    })
});



let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log('server started successfully');
});