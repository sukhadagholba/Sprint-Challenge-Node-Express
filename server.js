const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dbproject = require('./data/helpers/projectModel');
const dbaction = require('./data/helpers/actionModel');

const server = express();
server.use(express.json());
server.use(morgan('dev'));


server.get('/',(req, res) => {
	res.send("Testing....");
});


server.get('/api/projects', (req, res)=> {
const request =	dbproject.get();

	request.then(response => {
	res.status(200).json(response);
	})

	.catch(err => {
	 res.status(404).json({message: "The project information could not be retrieved"});	
	});
});


server.get('/api/actions', (req, res)=> {
const request = dbaction.get();

        request.then(response => {
        res.status(200).json(response);
        })

        .catch(err => {
         res.status(404).json({message: "The action information could not be retrieved"});
        });
});


server.listen(8000, () => console.log('API running on port 8000'));
