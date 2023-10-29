const express = require('express');
const apiMarketplaceController = express.Router();

apiMarketplaceController.use(express.json());

let marketplacePlugins = require('../data_deprecated/marketplace.json');

// Get Plugins
apiMarketplaceController.get('/marketPlugins', (req, res) => {
    res.json(marketplacePlugins);
});

// Put Plugin
apiMarketplaceController.put('/marketPlugins/:pluginID', (req, res) => {
    res.status(501).json({error: "Not implemented."});
});

// Delete Plugin
apiMarketplaceController.delete('/marketPlugins/:pluginID', (req, res) => {
    res.status(501).json({error: "Not implemented."});
});

module.exports = apiMarketplaceController;