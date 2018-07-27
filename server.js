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


server.get('/api/projects/:id', (req, res) => {
        const id = req.params.id;

        if(isNaN(id)){
        res.status(404).json({ error: "Entered Id should be a number"});                        
        }

        else{
	const request = dbproject.get(id);
        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The project with the specified ID does not exist." });
         else {
                 res.status(200).json(response);
         }

        })

        .catch(err => {
        res.status(404).json({error: "The project with the specified ID does not exist."});
        })

        }
});


server.get('/api/actions/:id', (req, res) => {
        const id = req.params.id;
 
        if(isNaN(id)){
        res.status(404).json({ error: "Entered Id should be a number" });
        }

        else{
        const request = dbaction.get(id);
        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The action with the specified ID does not exist." });
         else {
                 res.status(200).json(response);
	 }
	})

        .catch(err => {
        res.status(404).json({error: "The action with the specified ID does not exist."});
        })
}
});

server.post('/api/projects', (req, res) => {

        const {name, description, completed} = req.body;
        const project = {name, description, completed};
	console.log(req.body);

        if (!name || !description || completed ==="") {
                res.status(400).json({message: "Please provide name, description and completed status for the project."});
        }
        
        else{
        const request = dbproject.insert(project);

        request.then(response => {
                response.message ="Successfully added a new post";
		res.status(201).json(response);
        })

        .catch(error => {
        res.status(500).json({ message: "There was an error while saving the project to the database" });
        })
}  
});

server.post('/api/actions', (req, res) => {

        //if(!req.body.notes) {
	//const {project_id, description, completed} = req.body; 
	//let {notes} = "";
	//}

	//else {
        const {project_id, notes, description, completed} = req.body;
        //console.log(req.body);
	//}

	const action = {project_id, notes, description, completed};

        if (!project_id || !description || completed ==="" || !notes) {
                res.status(400).json({message: "Please provide project_id, description and completed status for the action."});
        }

        else{
        const request = dbaction.insert(action);

        request.then(response => {
                response.message ="Successfully added a new post";

                res.status(201).json(response);
        })

        .catch(error => {
        res.status(500).json({ message: "There was an error while saving the action to the database" });
        })
} 
});


server.delete('/api/projects/:id', (req, res) => {
        const id = req.params.id;
        const request = dbproject.remove(id);

        request.then(response => {
                if(response===1) {
                let responseObject ={};
                responseObject.message = `Successfully deleted project with id ${id}`;

                res.json(responseObject);
                }

                else res.status(404).json({ error: "The project with the specified ID does not exist." });
        })

        .catch(error => {
        res.status(500).json({ error: "The project could not be removed" });
        })

  });

server.delete('/api/actions/:id', (req, res) => {
        const id = req.params.id;
        const request = dbaction.remove(id);

        request.then(response => {
                if(response===1) {
                let responseObject ={};
                responseObject.message = `Successfully deleted action with id ${id}`;

                res.json(responseObject);
                }

                else res.status(404).json({ error: "The action with the specified ID does not exist." });
        })

        .catch(error => {
        res.status(500).json({ error: "The action could not be removed" });
        })

  });



server.use(function(req, res) {
  res.status(404).send("Error: Wrong path, check url");
});



server.listen(8000, () => console.log('API running on port 8000'));
