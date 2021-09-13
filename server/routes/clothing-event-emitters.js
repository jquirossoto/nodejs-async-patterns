const express = require('express');
const fs = require('fs').promises;
const datafile = 'server/data/clothing.json';
const router = express.Router();

module.exports = function (monitor) {
    let dataMonitor = monitor;

    //this will execute asyncronosly. Will be executed in the next cycle of the eventloop since the code is wrap in a setInmediate timer function
    dataMonitor.on('dataAdded', (itemName) => {
        setImmediate(() => console.log(`New data added: ${itemName}`));
    });

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

        .post(async function (req, res) {
            try {
                let data = await getClothingData();
                let nextId = getNextAvailableID(data);
                let newClothingItem = {
                    clothingID: nextId,
                    itemName: req.body.itemName,
                    price: req.body.price
                };
                data.push(newClothingItem);
                await saveClothingData(data);
                //emit
                dataMonitor.emit('dataAdded', newClothingItem.itemName);
                console.log('All done with post method. Returning data to browser');
                res.status(201).send(newClothingItem);
            } catch (error) {
                res.status(500).send(error);
            }
        })

    function getNextAvailableID(allClothingData) {
        let maxID = 0;
        allClothingData.forEach(function(element, index, array) {
            if(element.clothingID > maxID) {
                maxID = element.clothingID;
            }
        });
        return ++maxID;
    }
    
    function saveClothingData(data) {
        return fs.writeFile(datafile, JSON.stringify(data, null, 4));
    }

    // async functions are automatically wrap in a promise
    async function getClothingData() {
        let rawData = await fs.readFile(datafile, 'utf8');
        let clothingData = JSON.parse(rawData);
        return clothingData;
    }

    return router;
};