const express = require('express');
const {httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch, httpGetSpaceXHistory} = require('./launches.controller');

const launchesRouter = express.Router();


launchesRouter.get('/', httpGetAllLaunches);

launchesRouter.get('/history', httpGetSpaceXHistory);

launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch )
module.exports = launchesRouter;