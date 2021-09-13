const express = require('express');
const fs = require('fs').promises;
const datafile = 'server/data/clothing.json';
const router = express.Router();

/* GET all clothing */
router.route('/')
  .get(async function (req, res) { 
    //Async using promises with async/await
    try {
      let data = await getClothingData();
      res.send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  })

// async functions are automatically wrap in a promise
async function getClothingData() {
  let rawData = await fs.readFile(datafile, 'utf8');
  let clothingData = JSON.parse(rawData);
  return clothingData;
}

module.exports = router;