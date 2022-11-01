function getSchedule(data) {
  const res = [];
  for (const match of data) {
    let odds;
    if (match.bookmakers.length > 0) {
      odds = match.bookmakers.filter(bookmaker => bookmaker.key === "unibet")[0];
      if (odds === undefined) {
        odds = match.bookmakers[0];
      }
    } else
      odds = {key: null};
    res.push({
      country1: {
        name: match.home_team,
        odds: retrievePrice(odds, match.home_team),
        score: "?"
      },
      country2: {
        name: match.away_team,
        odds: retrievePrice(odds, match.away_team),
        score: "?"
      },
      draw: {
        name: "Nul",
        odds: retrievePrice(odds, "Draw")
      },
      service: odds.key,
      date: new Date(match.commence_time)
    });
  }
  return res;
}

function retrievePrice(odds, teamName) {
  if (odds.markets)
    return odds.markets.filter(market => market.key === "h2h")[0].outcomes.filter(team => team.name === teamName)[0].price;
  return null;
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
    case "USA":
      return "États-Unis";
    case "Wales":
      return "Pays de Galles";
    case "Argentina":
      return "Argentine";
    case "Saudi Arabia":
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
    case "Nul":
      return "Nul";
    default:
      return "Inconnu";
  }
}

export {getSchedule, getFrCountryName};
