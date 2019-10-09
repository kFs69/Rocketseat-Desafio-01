const express = require('express');
const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

function verifyId(req, res, next){
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project){
    res.status(400).send({ error: 'This project does not exists' })
  }

  return next();
}

function requests(req, res, next){
  numberOfRequests++;

  console.log(`Number of requests: ${numberOfRequests}`);
  
  return next();
}

server.use(requests);

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, task: [] };

  projects.push(project);

  res.json(projects);
});

server.get('/projects', (req, res) => {
  res.json(projects);
});

server.put('/projects/:id', verifyId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
   
  project.title = title;

  res.json(project);
});

server.delete('/projects/:id', verifyId, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
   
  projects.splice(projectIndex, 1);

  res.json(projects);
});

server.post('/projects/:id/tasks', verifyId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.task.push(title);

  res.json(projects);
});

server.listen(3333);