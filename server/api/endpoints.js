const express = require("express");
const router = express.Router()
const axios = require("axios")

router.get("/getOdds", function(req, res) {
  res.send(getOdds(req.query.country1, req.query.country2))
})

function getOdds(country1, country2) {
  axios.get("https://api.the-odds-api.com/v4/sports/upcoming/odds/?sport=soccer_fifa_world_cup&regions=eu&apiKey=88cb70d10ff95bda24c86159521a6590")
    .then(res => {
      console.log(findCountries(res.data, country1, country2))
    })
  return {oui: "non"}
}

function findCountries(data, country1, country2) {
  for(const game of data) {
    if(game.home_team === country1 && game.away_team === country2) {
      return game.bookmakers.filter(bookmaker => bookmaker.key === 'unibet')[0].markets
    }
  }
}

module.exports = router;
