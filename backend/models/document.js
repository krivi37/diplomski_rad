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
module.exports.getDocumentsByTitle = function(title, callback){
  const query = {title: title};
  Doc.find(query, callback);
}

module.exports.getDocumentByTitleAndSubjectName = function(title, subject_name, callback){
  const query = {title: title, subject: subject_name, archived: false};
  Doc.findOne(query, callback);
}

// Get both archived and unarchived documents
module.exports.getAllDocumentsByTitleAndSubjectName = function(title, subject_name, callback){
  const query = {title: title, subject: subject_name};
  Doc.find(query, callback);
}

module.exports.getDocumentsByTags = function(tags, callback){
  const query = {tags: {$all: tags}};
  Doc.find(query, callback);
}

module.exports.getDocumentByTitleAndSubjectId = function(title, id_number, callback){
  const query = {id_number: id_number};
  Subject.findOne(query, (err, data) => {
    if(err) throw err;
    else{
      query = {
        title: title,
        subject: data.subject_name
      }
    }
    Doc.findOne(query, callback);
  });
}

// Modifying documents
module.exports.setArchivedDocument = function(title, subject_name, callback){
  Doc.updateOne({"title": title, "subject": subject_name, "archived": false}, {"$set": {"archived": true}}, callback);
}

module.exports.updateDescription = function(title, subject_name, description, callback){
  Doc.updateOne({"title": title, "subject": subject_name, "archived": false}, {"$set": {"description": description}}, callback);
}

module.exports.updateTags = function (title, subject_name, tags, callback){
  Doc.updateOne({"title": title, "subject": subject_name, "archived": false}, {"$set": {"tags": tags}}, callback);
}

module.exports.updateTitle = function (title, subject_name, new_title, callback){
  Doc.updateOne({"title": title, "subject": subject_name, "archived": false}, {"$set": {"title": new_title}}, callback);
}

module.exports.addNewDocument = function(newDocument, callback){
  let titles = [newDocument.title];
  // Waiting is not needed
  Subject.addSubjectDocuments(newDocument.subject, titles, (err, data) => {
    if(err) throw err;
  });
  newDocument.save(callback);
}
