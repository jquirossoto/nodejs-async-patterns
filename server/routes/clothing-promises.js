const express = require('express');
const fs = require('fs');
const datafile = 'server/data/clothing.json';
const router = express.Router();

/* GET all clothing */
router.route('/')
  .get(function (req, res) { 
    //Async using promises
    getClothingData().then(data => {
      console.log('Got data');
      res.send(data);
    }).catch(error => {
      console.error('Error', error);
      res.status(500).send(error);
    }).finally(() => {
      console.log('Finally done.');
    });
    console.log('Doing more work!');
  });

function getClothingData() {
  return new Promise((resolve, reject) => {
    fs.readFile(datafile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}


module.exports = router;