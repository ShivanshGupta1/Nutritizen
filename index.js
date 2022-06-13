const mongoclient = require("mongodb").MongoClient;
const express = require("express");
const request = require("request");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

mongoclient
  .connect(
    "mongodb+srv://ShivanshGupta:india%402006@blogdb.xowev.mongodb.net/test?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
    }
  )

  .then((client) => {
    console.log("Connected to databases");
    const db = client.db("NutritizenDB");
    const userCollection = db.collection("userCollection");
    app.set("view engine", "ejs");
    app.get("/", (req, res) => {
      res.render("index");
    });
    app.get("/AI", (req, res) => {
      res.render("ai.ejs", { userDATA: null, error: null });
    });
    app.listen(3000, () => {
      console.log("The server has begun!");
    });
    app.get("/finddoctors", (req,res) => {
      res.render("doctors.ejs", {doctors: null, error: null, dataFound: undefined})
    })
    app.post("/finddoctors", (req,res) => {
       const options = {
         method: "GET",
         url: "https://google-maps-local-business-search-nearby-places.p.rapidapi.com/google-maps",
         qs: {
           keyword: "hospitals",
           location_name: req.body.location,
           language_name: "English",
           device: "desktop",
           os: "windows",
           start: "1",
           num: "10",
         },
         headers: {
           "X-RapidAPI-Host":
             "google-maps-local-business-search-nearby-places.p.rapidapi.com",
           "X-RapidAPI-Key":
             "3c5652e1bcmsh6b58e18266de2c0p1437bdjsn6dfb08d48596",
           useQueryString: true,
         },
       };
       request(options, function (error, response, body) {
         if (error) throw new Error(error);
        let doctorsData = JSON.parse(body);
        let dataFoundResult = true;
        if (doctorsData.data.items == null) {
            dataFoundResult = false
        } 
        console.log(doctorsData.data.items);
        res.render("doctors.ejs", {
          doctors: doctorsData.data.items,
          error: null,
          dataFound: dataFoundResult
        });
       });
       
    })
    app.get("/healthreport",(req,res)=>{
       res.render("report.ejs", { userData: null });
    })
    app.post("/healthreport", (req,res) => {
      userCollection
        .find({ email: req.body.email })
        .toArray()
        .then((user) => {
          console.log(user)
          res.render("report.ejs", { userData: user });
        })
        .catch((err) => console.log(err));
    })
    app.post("/AI", (req, res) => {
      console.log(req.body.weight);
      var submittedData = {
        name: req.body.name,
        email: req.body.mail,
        Age: req.body.age,
        Gender: req.body.gender,
        "Junk Food": req.body.food,
        Water: req.body.water,
        Weight: req.body.weight,
        "Increased Thirst": req.body.thirst,
        "Frequent Urination": req.body.urinate,
        "Frequent Hunger": req.body.hunger,
        "Frequently Lethargic": req.body.lethargic,
        "Blurred Vision": req.body.vision,
        "Slow Healing": req.body.healing,
        "Frequent Infection": req.body.infection,
        Numbness: req.body.numbness,
        "Darkened Skin": req.body.skin,
        Income: req.body.income,
        "Living Condition": req.body.living,
        Exercise: req.body.exercise,
      };
      var DATA = {
        Age: req.body.age,
        Gender: req.body.gender,
        "Junk Food": req.body.food,
        Water: req.body.water,
        Weight: req.body.weight,
        "Increased Thirst": req.body.thirst,
        "Frequent Urination": req.body.urinate,
        "Frequent Hunger": req.body.hunger,
        "Frequently Lethargic": req.body.lethargic,
        "Blurred Vision": req.body.vision,
        "Slow Healing": req.body.healing,
        "Frequent Infection": req.body.infection,
        Numbness: req.body.numbness,
        "Darkened Skin": req.body.skin,
        Income: req.body.income,
        "Living Condition": req.body.living,
        Exercise: req.body.exercise,
      };
      const options = {
        url: "https://askai.aiclub.world/2124f248-3ecc-4f02-929e-f573cb93fad0",
        method: "POST",
        body: JSON.stringify(DATA),
      };
      request(options, function (error, response, body) {
        if (error) {
          res.render("index", {
            userDATA: null,
            error: "Error Please try again",
          });
        } else {
            if (!body) userData =  {};
            if (typeof body === "object") userData = body;
            if (typeof body === "string") userData = JSON.parse(body);
          let newdata = JSON.parse(userData.body);
          console.log(newdata.predicted_label);
          res.render("ai.ejs", { userDATA: newdata, error: null });
          submittedData["prediction"] = newdata.predicted_label;
          userCollection
            .insertOne(submittedData)
            .then((result) => {
              console.log(result)
            })
            .catch((error) => console.log(error));
            }
      });

    });
  });


 