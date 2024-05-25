// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const crypto = require('crypto');
// const { TextDecoder } = require('util');
// const { default: mongoose } = require('mongoose');
// const { default: config } = require('./config');
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import config from './config.js';
import User from './models/Usermodel.js';

const app = express();
const port = 3000;

mongoose.connect(config.MONGODB_URI);
const database = mongoose.connection;

const userDeatils = User.find({});
// select * from user
console.log('User', userDeatils);



// main();
database.on('error', (error) => {
	console.log(error);
});

database.once('connected', () => {
	console.log('Database Connected');
});

// TODO code refractoring
// Create Todo model
// migrate all api to the database

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
console.log('This is our todo app');

// Load todos from JSON file
let todos = JSON.parse(fs.readFileSync('todos.json', 'utf-8'));

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});

app.get('/getAllTodos', (req, res) => {
	res.json(todos);
});

app.get('/getTodo/:id', (req, res) => {
	const id = req.params.id;
	const todo = todos.find((todo) => todo.id === id);
	if (todo) {
		res.json(todo);
	} else {
		res.send('Todo not found');
	}
});

app.post('/createTodo', (req, res) => {
	const todo = req.body;
	todo.id = crypto.randomUUID();
	todos.push(todo);
	saveTodosToFile();
	res.send('Todo created');
});

app.delete('/deleteTodo/:id', (req, res) => {
	const id = req.params.id;
	const index = todos.findIndex((todo) => todo.id === id);
	if (index === -1) {
		res.send('Todo not found');
	} else {
		todos.splice(index, 1);
		saveTodosToFile();
		res.send('Todo deleted');
	}
});

app.put('/updateTodo', (req, res) => {
	const id = req.body.id;
	const updatedTodo = req.body;
	const index = todos.findIndex((todo) => todo.id === id);

	if (index === -1) {
		res.send('Todo not found');
	} else {
		todos[index] = { ...todos[index], ...updatedTodo };
		saveTodosToFile();
		res.send('Todo updated');
	}
});

function saveTodosToFile() {
	fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2), 'utf-8');
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
