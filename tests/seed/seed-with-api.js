const axios = require('axios');

// const BaseURL = 'http://localhost:4001';
const BaseURL = 'https://trademaster-backend.gosolutia.com';
let authToken = '';

async function login() {
  try {
    const response = await axios.post(`${BaseURL}/svc_game/login`, {
      email: 'admin@ort.com',
      password: 'Password1',
    });
    authToken = response.data.token;
  } catch (error) {
    console.error('Error starting session:', error);
  }
}

async function createGame(name, players, initialMoney, startDate, endDate) {
  try {
    return await axios.post(`${BaseURL}/svc_game/games`, {
      name,
      players,
      initialMoney,
      startDate,
      endDate,
    }, {
      headers: {
        Authorization: authToken,
      },
    });
  } catch (error) {
    console.error('Error al crear el juego:', error);
  }
}

async function createStock(name, description, initialPrice, gameId, code, availableAmount) {
  try {
    return await axios.post(`${BaseURL}/svc_game/stocks`, {
      name,
      description,
      initialPrice,
      GameId: gameId,
      code,
      amount: availableAmount,
      availableAmount,
    }, {
      headers: {
        Authorization: authToken,
      },
    });
  } catch (error) {
    console.error('Error al crear la acción:', error);
  }
}

async function createStockPrice(date, price, stockId) {
  try {
    return await axios.post(`${BaseURL}/svc_game/stocks/${stockId}/prices`, {
      date,
      price
    }, {
      headers: {
        Authorization: authToken,
      },
    });
  } catch (error) {
    console.error('Error al crear el precio de la acción:', error);
  }
}

async function createNews(date, title, content, gameId, stockIds) {
  try {
    const response = await axios.post(`${BaseURL}/svc_game/news`, {
      date,
      title,
      content,
      GameId: gameId,
      stocks_id: stockIds,
    }, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data.id;
  } catch (error) {
    console.error('Error al crear la noticia:', error);
  }
}

async function main() {
  try {
    await login();

    const game1Id = await createGame('SpringBrake tournament', 10, 5000, '2023-10-01T12:00:00Z', '2023-12-31T12:00:00Z');
    const game2Id = await createGame('Anual traiding competition', 10, 10000, '2023-10-01T12:00:00Z', '2023-12-31T12:00:00Z');
    const game3Id = await createGame('Summer traiding competition', 10, 10000, '2023-10-01T12:00:00Z', '2023-12-31T12:00:00Z');

    let gamesIds = [game1Id.data.id, game2Id.data.id, game3Id.data.id];

    let gameStocks = [];

    for (const game of gamesIds) {
      const integerMaxValue = 2147483647;
      const stock1Id = await createStock('Apple Inc (AAPL)', 'Tech giant', 172, game, 'AAPL', integerMaxValue);
      const stock2Id = await createStock('Amazon.com Inc (AMZN)', 'E-commerce giant', 124, game, 'AMZN', integerMaxValue);
      const stock3Id = await createStock('NVIDIA Corporation (NVDA)', 'Semiconductor company', 435, game, 'NVDA', integerMaxValue);
      const stock4Id = await createStock('Tesla Inc (TSLA)', 'Electric vehicle and clean energy company', 246, game, 'TSLA', integerMaxValue);
      const stock5Id = await createStock('Meta Platforms Inc (META)', 'Social media giant', 300, game, 'META', integerMaxValue);
      const stock6Id = await createStock('Microsoft Corporation (MSFT)', 'Tech giant', 313, game, 'MSFT', integerMaxValue);
      const stock7Id = await createStock('Alphabet Inc Class A (GOOGL)', 'Tech giant', 132, game, 'GOOGL', integerMaxValue);
      const stock8Id = await createStock('Citigroup Inc (CCC)', 'Financial services corporation', 40, game, 'CCC', integerMaxValue);
      const stock9Id = await createStock('AT&T Inc (TTT)', 'Telecommunications company', 14, game, 'TTT', integerMaxValue);
      const stock10Id = await createStock('3M Company (MMM)', 'Multinational conglomerate', 89, game, 'MMM', integerMaxValue);

      gameStocks.push(stock1Id, stock2Id, stock3Id, stock4Id, stock5Id, stock6Id, stock7Id, stock8Id, stock9Id, stock10Id);
    };

    const stockPrices = {
      AAPL: [173, 171, 170, 170, 171, 176, 174, 173, 175, 179, 178, 175, 176, 174, 176, 179, 178, 177, 182, 189],
      AMZN: [129, 127, 125, 126, 126, 131, 129, 129, 135, 137, 139, 140, 144, 145, 141, 143, 138, 137, 135, 137],
      NVDA: [437, 435, 435, 435, 435, 440, 442, 440, 445, 447, 449, 450, 454, 455, 451, 453, 448, 447, 445, 447],
      TSLA: [248, 246, 246, 246, 246, 251, 253, 251, 256, 258, 260, 261, 265, 266, 262, 264, 259, 258, 256, 258],
      META: [302, 300, 300, 300, 300, 305, 307, 305, 310, 312, 314, 315, 319, 320, 316, 318, 313, 312, 310, 312],
      MSFT: [315, 313, 313, 313, 313, 318, 320, 318, 323, 325, 327, 328, 332, 333, 329, 331, 326, 325, 323, 325],
      GOOGL: [134, 132, 132, 132, 132, 137, 139, 137, 142, 144, 146, 147, 151, 152, 148, 150, 145, 144, 142, 144],
      CCC: [42, 40, 40, 40, 40, 45, 47, 45, 50, 52, 54, 55, 59, 60, 56, 58, 53, 52, 50, 52],
      TTT: [16, 14, 14, 14, 14, 19, 21, 19, 24, 26, 28, 29, 33, 34, 30, 32, 27, 26, 24, 26],
      MMM: [91, 89, 89, 89, 89, 94, 96, 94, 99, 101, 103, 104, 108, 109, 105, 107, 102, 101, 99, 101],
    };

    for (const stock of gameStocks) {
      for (let i = 0; i < 20; i++) {
        let stock_price = stockPrices[stock.data.code][i];
        let id = stock.data.id;
        let date = new Date() - ((i + 1) * 24 * 60 * 60 * 1000);
        await createStockPrice(date, stock_price, id);
      }
    }

    await createNews(new Date(), 'Apple Inc (AAPL) announces new iPhone 15', 'Apple Inc (AAPL) announces new iPhone 15', game1Id.data.id, [gameStocks[0].data.id]);
    await createNews(new Date(), 'Apple Inc (AAPL) announces new iPhone 15', 'Apple Inc (AAPL) announces new iPhone 15', game2Id.data.id, [gameStocks[10].data.id]);
    await createNews(new Date(), 'Apple Inc (AAPL) announces new iPhone 15', 'Apple Inc (AAPL) announces new iPhone 15', game3Id.data.id, [gameStocks[20].data.id]);

    await createNews(new Date(), 'Amazon.com Inc (AMZN) announces new Amazon Prime', 'Amazon.com Inc (AMZN) announces new Amazon Prime', game1Id.data.id, [gameStocks[1].data.id]);
    await createNews(new Date(), 'Amazon.com Inc (AMZN) announces new Amazon Prime', 'Amazon.com Inc (AMZN) announces new Amazon Prime', game2Id.data.id, [gameStocks[11].data.id]);
    await createNews(new Date(), 'Amazon.com Inc (AMZN) announces new Amazon Prime', 'Amazon.com Inc (AMZN) announces new Amazon Prime', game3Id.data.id, [gameStocks[21].data.id]);

    await createNews(new Date(), 'NVIDIA Corporation (NVDA) announces new GPU', 'NVIDIA Corporation (NVDA) announces new GPU', game1Id.data.id, [gameStocks[2].data.id]);
    await createNews(new Date(), 'NVIDIA Corporation (NVDA) announces new GPU', 'NVIDIA Corporation (NVDA) announces new GPU', game2Id.data.id, [gameStocks[12].data.id]);
    await createNews(new Date(), 'NVIDIA Corporation (NVDA) announces new GPU', 'NVIDIA Corporation (NVDA) announces new GPU', game3Id.data.id, [gameStocks[22].data.id]);

    await createNews(new Date(), 'Tesla Inc (TSLA) announces new car', 'Tesla Inc (TSLA) announces new car', game1Id.data.id, [gameStocks[3].data.id]);
    await createNews(new Date(), 'Tesla Inc (TSLA) announces new car', 'Tesla Inc (TSLA) announces new car', game2Id.data.id, [gameStocks[13].data.id]);
    await createNews(new Date(), 'Tesla Inc (TSLA) announces new car', 'Tesla Inc (TSLA) announces new car', game3Id.data.id, [gameStocks[23].data.id]);

    await createNews(new Date(), 'Meta Platforms Inc (META) announces new social media', 'Meta Platforms Inc (META) announces new social media', game1Id.data.id, [gameStocks[4].data.id]);
    await createNews(new Date(), 'Meta Platforms Inc (META) announces new social media', 'Meta Platforms Inc (META) announces new social media', game2Id.data.id, [gameStocks[14].data.id]);
    await createNews(new Date(), 'Meta Platforms Inc (META) announces new social media', 'Meta Platforms Inc (META) announces new social media', game3Id.data.id, [gameStocks[24].data.id]);

    await createNews(new Date(), 'Microsoft Corporation (MSFT) announces new Windows', 'Microsoft Corporation (MSFT) announces new Windows', game1Id.data.id, [gameStocks[5].data.id]);
    await createNews(new Date(), 'Microsoft Corporation (MSFT) announces new Windows', 'Microsoft Corporation (MSFT) announces new Windows', game2Id.data.id, [gameStocks[15].data.id]);
    await createNews(new Date(), 'Microsoft Corporation (MSFT) announces new Windows', 'Microsoft Corporation (MSFT) announces new Windows', game3Id.data.id, [gameStocks[25].data.id]);

    await createNews(new Date(), 'Alphabet Inc Class A (GOOGL) announces new Google', 'Alphabet Inc Class A (GOOGL) announces new Google', game1Id.data.id, [gameStocks[6].data.id]);
    await createNews(new Date(), 'Alphabet Inc Class A (GOOGL) announces new Google', 'Alphabet Inc Class A (GOOGL) announces new Google', game2Id.data.id, [gameStocks[16].data.id]);
    await createNews(new Date(), 'Alphabet Inc Class A (GOOGL) announces new Google', 'Alphabet Inc Class A (GOOGL) announces new Google', game3Id.data.id, [gameStocks[26].data.id]);

    await createNews(new Date(), 'Citigroup Inc (C) announces new bank', 'Citigroup Inc (C) announces new bank', game1Id.data.id, [gameStocks[7].data.id]);
    await createNews(new Date(), 'Citigroup Inc (C) announces new bank', 'Citigroup Inc (C) announces new bank', game2Id.data.id, [gameStocks[17].data.id]);
    await createNews(new Date(), 'Citigroup Inc (C) announces new bank', 'Citigroup Inc (C) announces new bank', game3Id.data.id, [gameStocks[27].data.id]);

    await createNews(new Date(), 'AT&T Inc (T) announces new phone', 'AT&T Inc (T) announces new phone', game1Id.data.id, [gameStocks[8].data.id]);
    await createNews(new Date(), 'AT&T Inc (T) announces new phone', 'AT&T Inc (T) announces new phone', game2Id.data.id, [gameStocks[18].data.id]);
    await createNews(new Date(), 'AT&T Inc (T) announces new phone', 'AT&T Inc (T) announces new phone', game3Id.data.id, [gameStocks[28].data.id]);

    await createNews(new Date(), '3M Company (MMM) announces new product', '3M Company (MMM) announces new product', game1Id.data.id, [gameStocks[9].data.id]);
    await createNews(new Date(), '3M Company (MMM) announces new product', '3M Company (MMM) announces new product', game2Id.data.id, [gameStocks[19].data.id]);
    await createNews(new Date(), '3M Company (MMM) announces new product', '3M Company (MMM) announces new product', game3Id.data.id, [gameStocks[29].data.id]);

    await createNews(new Date(), 'Crisis in Tech, prices are falling', 'Crisis in Tech, prices are falling', game1Id.data.id, [gameStocks[0].data.id, gameStocks[1].data.id, gameStocks[2].data.id, gameStocks[4].data.id, gameStocks[5].data.id, gameStocks[6].data.id]);
    await createNews(new Date(), 'Crisis in Tech, prices are falling', 'Crisis in Tech, prices are falling', game2Id.data.id, [gameStocks[10].data.id, gameStocks[11].data.id, gameStocks[12].data.id, gameStocks[14].data.id, gameStocks[15].data.id, gameStocks[16].data.id]);
    await createNews(new Date(), 'Crisis in Tech, prices are falling', 'Crisis in Tech, prices are falling', game3Id.data.id, [gameStocks[20].data.id, gameStocks[21].data.id, gameStocks[22].data.id, gameStocks[24].data.id, gameStocks[25].data.id, gameStocks[26].data.id]);

    await createNews(new Date(), 'New IA is created by META and runs in NVIDIA', 'New IA is created by META and runs in NVIDIA', game1Id.data.id, [gameStocks[2].data.id, gameStocks[4].data.id]);
    await createNews(new Date(), 'New IA is created by META and runs in NVIDIA', 'New IA is created by META and runs in NVIDIA', game2Id.data.id, [gameStocks[12].data.id, gameStocks[14].data.id]);
    await createNews(new Date(), 'New IA is created by META and runs in NVIDIA', 'New IA is created by META and runs in NVIDIA', game3Id.data.id, [gameStocks[22].data.id, gameStocks[24].data.id]);

    await createNews(new Date(), 'New phone is created by Apple and runs in Microsoft', 'New phone is created by Apple and runs in Microsoft', game1Id.data.id, [gameStocks[0].data.id, gameStocks[5].data.id]);
    await createNews(new Date(), 'New phone is created by Apple and runs in Microsoft', 'New phone is created by Apple and runs in Microsoft', game2Id.data.id, [gameStocks[10].data.id, gameStocks[15].data.id]);
    await createNews(new Date(), 'New phone is created by Apple and runs in Microsoft', 'New phone is created by Apple and runs in Microsoft', game3Id.data.id, [gameStocks[20].data.id, gameStocks[25].data.id]);

    await createNews(new Date(), 'Citigroup buys AT&T actions', 'Citigroup buys AT&T actions', game1Id.data.id, [gameStocks[7].data.id, gameStocks[8].data.id]);
    await createNews(new Date(), 'Citigroup buys AT&T actions', 'Citigroup buys AT&T actions', game2Id.data.id, [gameStocks[17].data.id, gameStocks[18].data.id]);
    await createNews(new Date(), 'Citigroup buys AT&T actions', 'Citigroup buys AT&T actions', game3Id.data.id, [gameStocks[27].data.id, gameStocks[28].data.id]);

    await createNews(new Date(), '3M creates new Tape that Tesla will use in their cars', '3M creates new Tape that Tesla will use in their cars', game1Id.data.id, [gameStocks[3].data.id, gameStocks[9].data.id]);
    await createNews(new Date(), '3M creates new Tape that Tesla will use in their cars', '3M creates new Tape that Tesla will use in their cars', game2Id.data.id, [gameStocks[13].data.id, gameStocks[19].data.id]);
    await createNews(new Date(), '3M creates new Tape that Tesla will use in their cars', '3M creates new Tape that Tesla will use in their cars', game3Id.data.id, [gameStocks[23].data.id, gameStocks[29].data.id]);

    await createNews(new Date(), 'Microsoft release new windows 12 and has META and NVIDIA support', 'Microsoft release new windows 12 and has META and NVIDIA support', game1Id.data.id, [gameStocks[2].data.id, gameStocks[4].data.id, gameStocks[5].data.id, gameStocks[6].data.id]);
    await createNews(new Date(), 'Microsoft release new windows 12 and has META and NVIDIA support', 'Microsoft release new windows 12 and has META and NVIDIA support', game2Id.data.id, [gameStocks[12].data.id, gameStocks[14].data.id, gameStocks[15].data.id, gameStocks[16].data.id]);
    await createNews(new Date(), 'Microsoft release new windows 12 and has META and NVIDIA support', 'Microsoft release new windows 12 and has META and NVIDIA support', game3Id.data.id, [gameStocks[22].data.id, gameStocks[24].data.id, gameStocks[25].data.id, gameStocks[26].data.id]);

    console.log('Juegos, stocks y noticias creados con éxito.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();