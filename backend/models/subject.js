//Subject model and operations on database
const mongoose = require('mongoose');
const config = require('../config/database');
var moment = require('moment');

// User Schema
const SubjectSchema = mongoose.Schema ({
  
  id_number: {
      type: String,
      required: true
  },

  submission_date: {
      type : Date,
      required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  keywords: {
    type: [String],
    required: true
  },

  category: {
    type: String,
    required: true
  },

  submitter: {
      type: String,
      required: true
  },

  employees: {
      type: [String],
      required: true
  },

  department: {
    type: String,
    required: true
  },

  documents:{
    type: [String],
    required: true
  }

});

const Subject = module.exports = mongoose.model('subjects', SubjectSchema);

module.exports.getSubjectById = function(id_number, callback){
    const query = {id_number: id_number};
    Subject.findOne(query, callback);
}

module.exports.getSubjectsByDate = function (date, callback){
    const query = {submission_date: date};
    Subject.find(query, callback);
}

module.exports.getSubjectsByKeywords = function (keywords, callback){
    const query = {keywords: {$all: keywords}};
    Subject.find(query, callback);
}

module.exports.getSubjectByTitle = function (title, callback){
    const query = {title: title};
    Subject.findOne(query, callback);
}

module.exports.getSubjectsByCategory = function (category, callback){
    const query = {category: category};
    Subject.find(query, callback);
}

module.exports.getSubjectsBySubmitter = function (submitter, callback){
    const query = {submitter: submitter};
    Subject.find(query, callback);
}

module.exports.getSubjectsByDepartment = function (department, callback){
    const query = {department: department};
    Subject.find(query, callback);
}

module.exports.getSubjectsByEmployees = function (employees, callback){
    const query = {employees: {$all: employees}};
    Subject.find(query, callback);
}

module.exports.getSubjectByDocuments = function (documents, callback){
    const query = {documents: {$all: documents}};
    Subject.find(query, callback);
}

module.exports.updateSubjectTitle = function (param, new_title, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$set": {"title": new_title}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$set": {"title": new_title}}, callback);
    }
}

module.exports.updateSubjectDescription = function (param, description, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$set": {"description": description}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$set": {"description": description}}, callback);
    }
}

// If needed to add additional keywords
module.exports.addSubjectKeywords = function (param, keywords, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$addToSet": {"keywords": {"$each": keywords}}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$addToSet": {"keywords": {"$each": keywords}}}, callback);
    }
}

module.exports.updateSubjectKeywords = function (param, keywords, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$set": {"keywords": keywords}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$set": {"keywords": keywords}}, callback);
    }
}

module.exports.updateSubjectCategory = function (param, category, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": title}, {"$set": {"category": category}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$set": {"category": category}}, callback);
    }
}

// Add addition employees
module.exports.addSubjectEmployees = function (param, employees, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$addToSet": {"employees": {"$each": employees}}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$addToSet": {"employees": {"$each": employees}}}, callback);
    }
}

module.exports.updateSubjectEmployees = function (param, employees, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$set": {"employees": employees}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$set": {"employees": employees}}, callback);
    }
}

module.exports.updateSubjectDepartment = function (param, department, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$set": {"department": department}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$set": {"department": department}}, callback);
    }
}

// Add additional documents
module.exports.addSubjectDocuments = function (param, documents, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": param}, {"$addToSet": {"documents": {"$each": documents}}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": param}, {"$addToSet": {"documents": {"$each": documents}}}, callback);
    }
}

// Update documents
module.exports.updateSubjectDocuments = function (param, documents, callback){
    if(typeof param == "string"){
        Subject.updateOne({"title": title}, {"$set": {"documents": documents}}, callback);
    }
    else if (typeof param == "number"){
        Subject.updateOne({"id_number": title}, {"$set": {"documents": documents}}, callback);
    }
}


module.exports.AddSubject = function (newSubject, callback){
    newSubject.save(callback);
}