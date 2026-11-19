const {getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById,} = require('../../models/launches.model');

async function httpGetAllLaunches(req,res){
return res.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunch(req,res){
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target){
            return res.status(400).json({
                error: 'Missing required launch property',
            });
        }
    launch.launchDate = new Date(launch.launchDate);
   if(isNaN(launch.launchDate)){
    return res.status(400).json({
        error: 'Invalid launch date',
    });
   }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);
    if(!existsLaunch) {
    return res.status(404).json({
        error: 'Launch not found',
    });
    }
    const aborted = await abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.status(200).json({
        ok: true,
    });
}




const SPACEX_HISTORY_URL =
    'https://ll.thespacedevs.com/2.3.0/launches/previous/';

let historyCache = null;
let historyCacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000;

async function httpGetSpaceXHistory(req, res) {
    try {
        if (
            historyCache &&
            Date.now() - historyCacheTime < CACHE_DURATION
        ) {
            return res.status(200).json(historyCache);
        }

        const params = new URLSearchParams({
            lsp__name: 'SpaceX',
            limit: '100',
            mode: 'normal',
            ordering: 'net',
            format: 'json',
        });

        const response = await fetch(
            `${SPACEX_HISTORY_URL}?${params}`
        );

        if (!response.ok) {
            throw new Error(
                `Launch Library API error: ${response.status}`
            );
        }

        const data = await response.json();



        const launches = data.results.map((launch) => ({
            id: launch.id,
            flightNumber: launch.agency_launch_attempt_count,
            launchDate: launch.net,
            mission: launch.mission?.name || launch.name,
            rocket:
                launch.rocket?.configuration?.full_name || 'Unknown',
                launchSite : launch.pad?.name || 'Unknown',
                customers: [],
            success: launch.status?.abbrev === 'Success',
            status: launch.status?.name || 'Unknown',
            upcoming: false,
        }));

        launches.sort(
            (a, b) =>
                new Date(a.launchDate) - new Date(b.launchDate)
        );

        historyCache = launches;
        historyCacheTime = Date.now();

        return res.status(200).json(launches);
    } catch (error) {
        console.error('SpaceX History Error:', error);

        return res.status(502).json({
            error: 'Unable to fetch SpaceX launch history',
        });
    }
}



module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
    httpGetSpaceXHistory,
}