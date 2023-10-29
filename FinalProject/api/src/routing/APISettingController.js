const express = require('express');
const apiSettingController = express.Router();

apiSettingController.use(express.json());

let settings = require('../data_deprecated/settings.json');
let downloadedPlugins = require('../data_deprecated/downloadedPlugins.json');

// Get Settings
apiSettingController.get('/settings', (req, res) => {
    res.json(settings);
});

// Put Settings
apiSettingController.put('/settings', (req, res) => {
    // Placeholder
    let newValue = {
        CSSSettings: "default",
        screenReader: "on",
        colorblindnessSetting: "on"
    };
    res.json(newValue);
});

// Put a Setting
apiSettingController.put('/settings/:settingID', (req, res) => {
    // Placeholder
    let newValue = {
        CSSSettings: "default",
        screenReader: "on",
        colorblindnessSetting: "on"
    };
    res.json(newValue);
});

// Get Plugins
apiSettingController.get('/plugins', (req, res) => {
    res.json(downloadedPlugins);
});

// Get Plugin
apiSettingController.get('/plugins/:pluginId', (req, res) => {
    const pluginid = req.params.pluginId;
    let plugin = downloadedPlugins.find(plugin => plugin.name = pluginid);
    if (plugin) {
        res.json(plugin);
    } else {
        res.status(404).json({error: 'Plugin not found.'});
    }
});

// Post Plugin
apiSettingController.post('/plugins/:pluginID', (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});

// Put Plugin
apiSettingController.put('/plugins/:pluginID', (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});

// Delete Plugins
apiSettingController.delete('/plugins', (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});

// Delete Plugin
apiSettingController.delete('/plugins/:pluginID', (req, res) => {
    res.status(501).json({error: 'Not implemented'});
});

module.exports = apiSettingController;