const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config({path: '../.env'});
const router = express.Router()
const axios = require("axios")

const USER_TEST = {
  name : "Eloi",
  pass: "password",
  avatar : "https://i.kym-cdn.com/photos/images/newsfeed/001/225/928/a11.jpg",
  score : {
    coins : [
      {
        amount : 0,
        date: new Date("2022-07-08")
      }
    ],
    forecasted : 0,
    correct : 0,
    wrong : 0
  }
}

/**
 * Connect to MongoDB
 */
let collection_users;
let collection_results;
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => {
  const db = client.db("mondial_2022");
  collection_users = db.collection("users");
  collection_results = db.collection("results");
})

/**
 * API END POINTS
 */

router.get("/getOddsApiData", async function(req, res) {
  const data = await getOddsApiData()
  res.send(data)
})

router.get("/getScore", async function(req, res) {
  const data = await getScore(req.query.country1, req.query.country2)
  res.send(data)
})

router.get("/getUser", async (req, res) => {
  const user = await getUser(req.query.username)
  res.send(user)
})

router.post("/addUser", async (req, res) => {
  await addUser(req.body)
  res.status(201).send()
})

router.post("/updateUser", async (req, res) => {
  await updateUser(req.body)
  res.status(201).send()
})

router.get("/getResults", async (req, res) => {
  const results = await getResults()
  res.send(results)
})

router.post("/addResult", async (req, res) => {
  await addResult(req.body)
  res.status(201).send()
})


/* ----------------------------------- */


async function addUser(user) {
  await collection_users.insertOne(user)
}

async function updateUser(user) {
  await collection_users.updateOne({name : user.name}, {$set : user})
}


async function getUser(username) {
  return await collection_users.findOne({name: username})
}

function getStats(user) {
  let coins, rest
  ({coins, ...rest} = user.score)
  return rest
}

function getCoins(user) {
  let coins, rest
  ({coins, ...rest} = user.score)
  return coins
}

async function getResults() {
  return await collection_results.find({}).toArray()
}

async function addResult(result) {
  result.time = new Date(result.time)
  await collection_results.insertOne(result)
}


async function getOddsApiData() {
  const data = await axios.get("https://api.the-odds-api.com/v4/sports/upcoming/odds/?sport=soccer_fifa_world_cup&regions=eu&apiKey="+process.env.ODDS_API_KEY)
  return data.data
}

async function getScore(country1, country2) {
  const response = await axios.get("https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/scores/?apiKey="+process.env.ODDS_API_KEY)
  return findCountries(response.data, country1, country2)
}


module.exports = router;
