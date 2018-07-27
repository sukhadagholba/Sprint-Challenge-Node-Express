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


server.get('/api/projects/:id/actions', (req, res) => {
        const id = req.params.id;

       const request = dbproject.getProjectActions(id);

        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The project with the specified ID does not exist" });
         else {
                response.unshift(" Actions for the specified project are:");
                 res.status(200).json(response);
         }

        })

        .catch(err => {
        res.status(404).json({error: "The project  with the specified ID does not exist."});
        })

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

	else if (description.length>128) res.status(400).json({message: "Description for the project should be less than 128 characters"});
        
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

	if(isNaN(req.body.project_id)){
        res.status(404).json({ error: "Project_id should be a number" });
        }

	else if (req.body.description.length>128) res.status(400).json({message: "Description for the project should be less than 128 characters"});

	else {

        const {project_id, notes, description, completed} = req.body;
	const action = {project_id, notes, description, completed};

        if (!project_id || !description || completed ==="" || !notes) {
                res.status(400).json({message: "Please don't leave project_id, description and completed fields empty."});
        }

        else{
        const request = dbaction.insert(action);

        request.then(response => {
                response.message ="Successfully added a new action";

                res.status(201).json(response);
        })

        .catch(error => {
        res.status(500).json({ message: "There was an error while saving the action to the database" });
        })
}
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


server.put('/api/projects/:id', (req, res) => {
  const {name, description, completed} = req.body;

  const id =  req.params.id;
  const project = {name, description, completed}

	if (!name || !description || completed ==="") {
                res.status(400).json({message: "Please don't leave name, description and completed fields empty for the project."});
        }

        else if (description.length>128) res.status(400).json({message: "Description for the project should be less than 128 characters"});


	else{
 	const request = dbproject.update(id, project);

        request.then(response => {
                if(response===0)  res.status(404).json({ message: "The project with the specified ID does not exist." });
                else{ 
                        //response.message= "Successfully updated the project with new information";
                        res.status(200).json(response);
                }
        })

        .catch(error => {
        res.status(500).json({ message: "Couldn't update the project" });
        })
}       
});



server.put('/api/actions/:id', (req, res) => {
  const {project_id, description, completed, notes} = req.body;

  const id =  req.params.id;
  const action = {project_id, description, completed, notes}


	if (!project_id || !description || completed ==="" || !notes) {
                res.status(400).json({message: "Please don't leave project_id, description and completed fields empty for the action."});
        }

        else if (description.length>128) res.status(400).json({message: "Description for the action should be less than 128 characters"});

	else if (isNaN(project_id)) res.status(400).json({message: "project_id should be a number"});

	else{
 	const request = dbaction.update(id, action);


        request.then(response => {
                if(response===0)  res.status(404).json({ message: "The action with the specified ID does not exist." });
                else{
                        response.message= "Successfully updated the action";
                        res.status(200).json(response);
                }
        })

        .catch(err => {
        res.status(500).json({ message: "Couldn't update the action" });
        })
}
});




server.use(function(req, res) {
  res.status(404).send("Error: Wrong path, check url");
});



server.listen(8000, () => console.log('API running on port 8000'));
