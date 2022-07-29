const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.getOddsApiData = functions
  .region("europe-west1")
  .runWith({ secrets: ["ODDS_API_KEY"] })
  .https.onRequest((req, res) => {
    cors(req, res, () => {
      if (req.method !== "GET") {
        return res.status(401).json({
          message: "Not allowed"
        });
      }
      axios.get("https://api.the-odds-api.com/v4/sports/upcoming/odds/?sport=soccer_fifa_world_cup&regions=eu&apiKey=" + process.env.ODDS_API_KEY)
        .then(response => {
          return res.status(200).json(response.data);
        })
        .catch(err => {
          return res.status(500).json({
            error: err
          });
        });
    });
  });


