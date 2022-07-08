const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config({path: '../.env'});
const router = express.Router()
const axios = require("axios")

const USER_TEST = {
  name : "Eloi",
  pass: "password",
  color: "rgba(255,0,0,1)",
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
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => {
  const db = client.db("mondial_2022");
  collection_users = db.collection("users");
})

/**
 * API END POINTS
 */

router.get("/getOdds", async function(req, res) {
  const data = await getOdds(req.query.country1, req.query.country2)
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


/* ----------------------------------- */


async function addUser(user) {
  await collection_users.insertOne(user)
}

async function updateUser(user) {
  await collection_users.updateOne({name : user.name}, {$set : user})
}


async function getUser(username) {
  let res = await collection_users.find({name: username}).toArray()
  if(res.length > 1)
    console.error("Multiple users with same name")
  else
    return res[0]
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


async function getOdds(country1, country2) {
  const response = await axios.get("https://api.the-odds-api.com/v4/sports/upcoming/odds/?sport=soccer_fifa_world_cup&regions=eu&apiKey="+process.env.ODDS_API_KEY)
  const match = findCountries(response.data, country1, country2)
  return match.bookmakers.filter(bookmaker => bookmaker.key === 'unibet')[0].markets
}

async function getScore(country1, country2) {
  const response = await axios.get("https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/scores/?apiKey="+process.env.ODDS_API_KEY)
  return findCountries(response.data, country1, country2)
}

function findCountries(data, country1, country2) {
  for(const game of data) {
    if(game.home_team === country1 && game.away_team === country2) {
      return game
    }
  }
  return null
}

module.exports = router;

