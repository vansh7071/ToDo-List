const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + "/date.js")
var $ = require("jquery");
const app = express()


let items = [];
const workItems = [];

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"))

app.get('/', function (req, res) {
    const day = date.getDate()

    res.render('list', {
        listTitle: day,
        newlistItems: items
    });
})

app.post('/', function (req, res) {

    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }



    /*

    items.push(item)

    console.log(items);

    res.redirect("/")*/
})

app.get("/work", function (req, res) {

    res.render("list", {
        listTitle: "Work List",
        newlistItems: workItems
    });

})

app.post("/reset", function (req, res) {

    items = [];
    res.redirect("/");
})


app.listen(5000, function () {
    console.log('server started on port 5000');
})