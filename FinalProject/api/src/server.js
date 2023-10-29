const express = require('express');
const router = express.Router();

const app = express();

// Switch ports for real thing. Comment is only here for testing purposes.
//const PORT = process.env.PORT;
const PORT = 80;

const folderRouter = require('./routing/APIFolderController');
const marketplaceRouter = require('./routing/APIMarketplaceController');
const noteRouter = require('./routing/APINoteController');
const settingAndPluginRouter = require('./routing/APISettingController');
const accountRouter = require('./routing/APIAccountController');

router.use(folderRouter);
router.use(marketplaceRouter);
router.use(noteRouter);
router.use(settingAndPluginRouter);
router.use(accountRouter);

app.use(express.json()); // i dont think we need this?
app.use(router);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

module.exports = router;
