const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontendRoutes/frontendRoutes');

router.use(frontendRouter);

module.exports = router;