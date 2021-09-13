const express = require('express');
const fs = require('fs');
const datafile = 'server/data/clothing.json';
const router = express.Router();

/* GET all clothing */
router.route('/')
  .get(function (req, res) {
    //Async using callbacks
    getClothingData((err, data) => {
      if (err) {
        console.error('error', err);
      } else {
        res.send(data);
      }
    });
  });

function getClothingData(callback) {
  fs.readFile(datafile, 'utf8', (err, data) => {
    callback(err, data);
  });
}


module.exports = router;