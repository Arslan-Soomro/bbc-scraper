const express = require('express');
const { scrapeBBCLinks } = require('./Links-Scraper');
const { scrapeBBCStories } = require('./Stories-Scraper');
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    //res.json({message: "Hello World"});
    console.log('approached');
})

app.get('/scrape', async (req, res) => {
    try{
        res.sendFile(path.join(__dirname, 'public', 'scrape.html'));
        
        //await scrapeBBCLinks();
        await scrapeBBCStories();

    }catch(err){
        console.log("Error@Scrape: " + err.message);
    }
});

app.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT );
});