const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");



const { schemaName } = new Schema({ fields });

module.exports = mongoose.model('{modelName}', { schemaName });