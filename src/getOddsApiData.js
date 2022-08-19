function getOdds(data, country1, country2) {
  const match = findCountries(data, country1, country2);
  return match.bookmakers.filter(bookmaker => bookmaker.key === "unibet")[0].markets;
}

function findCountries(data, country1, country2) {
  for (const game of data) {
    if (game.home_team === country1 && game.away_team === country2) {
      return game;
    }
  }
  return null;
}

function getSchedule(data) {
  const res = [];
  for (const match of data) {
    res.push({
      country1: {
        name: match.home_team,
        score: "?"
      },
      country2: {
        name: match.away_team,
        score: "?"
      },
      date: new Date(match.commence_time)
    });
  }
  return res;
}

function getFrCountryName(countryName) {
  switch (countryName) {
    case "Qatar":
      return "Qatar";
    case "Ecuador":
      return "Equateur";
    case "Senegal":
      return "Sénégal";
    case "Netherlands":
      return "Pays-Bas";
    case "England":
      return "Angleterre";
    case "Iran":
      return "Iran";
    case "United States":
      return "États-Unis";
    case "Wales":
      return "Pays de Galles";
    case "Argentina":
      return "Argentine";
    case "Saudia Arabia":
      return "Arabie Saoudite";
    case "Mexico":
      return "Mexique";
    case "Poland":
      return "Pologne";
    case "France":
      return "France";
    case "Australia":
      return "Australie";
    case "Denmark":
      return "Danemark";
    case "Tunisia":
      return "Tunisie";
    case "Spain":
      return "Espagne";
    case "Costa Rica":
      return "Costa Rica";
    case "Germany":
      return "Allemagne";
    case "Japan":
      return "Japon";
    case "Belgium":
      return "Belgique";
    case "Canada":
      return "Canada";
    case "Morocco":
      return "Maroc";
    case "Croatia":
      return "Croatie";
    case "Brazil":
      return "Brésil";
    case "Serbia":
      return "Serbie";
    case "Switzeland":
      return "Suisse";
    case "Cameroon":
      return "Cameroun";
    case "Portugal":
      return "Portgual";
    case "Ghana":
      return "Ghana";
    case "Uruguay":
      return "Uruguay";
    case "South Korea":
      return "Corée du Sud";
    default:
      return "Inconnu";
  }
}

export { getOdds, getSchedule, getFrCountryName };
