require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const {loadPlanetsData} = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

const MONGO_URL = `mongodb+srv://nasa-api:${password}@cluster0.yztaxio.mongodb.net/`;

const server = http.createServer(app);

mongoose.connection.on('open', ()=>{
    console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', (err)=>{
    console.error(err);

})

async function startServer(){
await mongoose.connect(MONGO_URL);
await loadPlanetsData();

server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
});
}

startServer();