//Document model and operations on database
const mongoose = require('mongoose');
const config = require('../config/database');
var moment = require('moment');
const Subject = require('./subject');

// User Schema
const DocumentSchema = mongoose.Schema ({
  
  title: {
      type: String,
      required: true
  },

  submission_date: {
      type : Date,
      required: true
  },

  subject: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  tags: {
    type: [String],
    required: true
  },

  archived: {
    type: Boolean,
    required: true
  },

  version: {
    type: Number,
    required: true
  }

});

const Doc = module.exports = mongoose.model('documents', DocumentSchema);

// Getters
// Get archived or unarchived documents by criteria
module.exports.getDocuments = function(params, archived, callback){
  const query = {
    title: params.title,
    submission_date: params.submission_date,
    description: params.description,
    subject: params.subject,
    archived: archived
  }

// Filtering undefined values from query
let conditions = Object.keys(query).reduce((result, key) => {
    if(query[key]){
        result[key] = query[key];
    }
    else if (key == 'archived' && query[key] != undefined) result[key] = query[key];
    return result;
}, {});

if(params.tags != undefined) conditions.tags = {$all: params.tags};

Doc.find(conditions, callback);
}; 

// Get both archived and unarchived documents by criteria
module.exports.getAllDocuments = function(params, callback){
  const query = {
    title: params.title,
    submission_date: params.submission_date,
    description: params.description,
    subject: params.subject
  }

// Filtering undefined values from query
let conditions = Object.keys(query).reduce((result, key) => {
    if(query[key]){
        result[key] = query[key];
    }
    return result;
}, {});

if(params.tags != undefined) conditions.tags = {$all: params.tags};

Doc.find(conditions, callback);
}; 

// Modifying documents
module.exports.updateDocuments = function(keys, params, callback){
  const query_conditions = {
    title: keys.title,
    submission_date: keys.submission_date,
    description: keys.description,
    subject: keys.subject,
    archived: false //only non archived documents may be modified
};

let conditions = Object.keys(query_conditions).reduce((result, key) => {
    if(query_conditions[key]){
        result[key] = query_conditions[key];
    }
    else if (key == 'archived' && query_conditions[key] != undefined) result[key] = query_conditions[key];
    return result;
}, {});

if(keys.tags != undefined) conditions.tags = {$all: keys.tags};

const query = {
    title: params.title,
    submission_date: params.submission_date,
    description: params.description,
    subject: params.subject,
    archived: params.archived,
    tags: params.tags
}

let update_params = Object.keys(query).reduce((result, key) => {
    if(query[key]){
        result[key] = query[key];
    }
    else if (key == 'archived' && query[key] != undefined) result[key] = query[key];
    return result;
}, {});



let set_param = {
    $set: update_params
};

Doc.updateMany(conditions,set_param, callback);
};

module.exports.addNewDocument = function(newDocument, callback){
  let titles = [newDocument.title];
  // Waiting is not needed
  Subject.addSubjectDocuments(newDocument.subject, titles, (err, data) => {
    if(err) throw err;
  });
  newDocument.save(callback);
}
