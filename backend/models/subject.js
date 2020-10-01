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

// Universal get by any parameter
module.exports.getSubjects = function(params, callback){
    const query = {
        id_number: params.id_number, 
        submission_date: params.submission_date,
        description: params.description,
        //keywords: params.keywords,
        category: params.category,
        submitter: params.submitter,
        //employees: params.employees,
        department: params.department,
        //documents: params.documents
    };

    // Filtering undefined values from query
    let conditions = Object.keys(query).reduce((result, key) => {
        if(query[key]){
            result[key] = query[key];
        }
        return result;
    }, {});

    if(params.title != undefined) {
        if(params.title.length == undefined) conditions.title = {$all: params.title};
        else conditions.title = {$in: params.title};
    }
    if(params.documents != undefined) conditions.documents = {$all: params.documents};
    if(params.employees != undefined) conditions.employees = {$all: params.employees};
    if(params.keywords != undefined) conditions.keywords = {$all: params.keywords};

    Subject.find(conditions).lean().exec(callback);
}

// Universal update subject. It can update more than one subject if, for example the criteria is by keywords

module.exports.updateSubjects = function (keys, params, callback){
    const query_conditions = {
        id_number: keys.id_number, 
        submission_date: keys.submission_date,
        description: keys.description,
        category: keys.category,
        submitter: keys.submitter,
        department: keys.department,
    };

    let conditions = Object.keys(query_conditions).reduce((result, key) => {
        if(query_conditions[key]){
            result[key] = query_conditions[key];
        }
        return result;
    }, {});

    if(keys.title != undefined) {
        if(keys.title.length == undefined) conditions.title = {$all: keys.title};
        else conditions.title = {$in: keys.title};
    }
    if(keys.documents != undefined) conditions.documents = {$all: keys.documents};
    if(keys.employees != undefined) conditions.employees = {$all: keys.employees};
    if(keys.keywords != undefined) conditions.keywords = {$all: keys.keywords};

    const query = {
        id_number: params.id_number, 
        title: params.title,
        submission_date: params.submission_date,
        description: params.description,
        keywords: params.keywords,
        category: params.category,
        submitter: params.submitter,
        employees: params.employees,
        department: params.department,
        //documents: params.documents
    }

    let update_params = Object.keys(query).reduce((result, key) => {
        if(query[key]){
            result[key] = query[key];
        }
        return result;
    }, {});

    let set_param = {
        $set: update_params
    };

    Subject.updateMany(conditions,set_param, callback);

}

module.exports.addDocument = function (titles, document, callback){
    Subject.updateMany({title: {$in: titles}}, {$addToSet: {documents: document}}, callback);
}

module.exports.RemoveDocument = function(titles, document, callback){
    Subject.updateMany({title: {$in: titles}}, {$pull: {documents: {$all: document}}}, callback);
}

module.exports.AddSubject = function (newSubject, callback){
    newSubject.save(callback);
}