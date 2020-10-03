//Document model and operations on database
const mongoose = require('mongoose');
const config = require('../config/database');
var moment = require('moment');
const Subject = require('./subject');

// User Schema
const DocumentSchema = mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  submission_date: {
    type: Date,
    required: true
  },

  subjects: {
    type: [String],
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
module.exports.getDocuments = function (params, archived, callback) {
  const query = {
    submission_date: params.submission_date,
    description: params.description,
    archived: archived
  }

  // Filtering undefined values from query
  let conditions = Object.keys(query).reduce((result, key) => {
    if (query[key]) {
      result[key] = query[key];
    }
    else if (key == 'archived' && query[key] != undefined) result[key] = query[key];
    return result;
  }, {});


  if (params.title != undefined) {
    if (params.title.length == undefined) conditions.title = { $all: params.title };
    else conditions.title = { $in: params.title };
  }
  if (params.tags != undefined) conditions.tags = { $all: params.tags };
  if (!params.forEmployee) {
    if (params.subjects != undefined) conditions.subjects = { $all: params.subjects };
  }
  else {
    if (params.subjects != undefined) conditions.subjects = { $in: params.subjects };
  }
  if (conditions.submission_date != undefined) conditions.submission_date = moment(conditions.submission_date).format("YYYY-MM-DD");

  Doc.find(conditions).lean().exec(callback);
};

// Get both archived and unarchived documents by criteria
module.exports.getAllDocuments = function (params, callback) {
  const query = {
    title: params.title,
    submission_date: params.submission_date,
    description: params.description,
  }

  // Filtering undefined values from query
  let conditions = Object.keys(query).reduce((result, key) => {
    if (query[key]) {
      result[key] = query[key];
    }
    return result;
  }, {});

  if (params.tags != undefined) conditions.tags = { $all: params.tags };
  if (params.subjects != undefined) conditions.subjects = { $all: params.subjects };
  if (conditions.submission_date != undefined) conditions.submission_date = moment(conditions.submission_date).format("YYYY-MM-DD");

  Doc.find(conditions).lean().exec(callback);
};

// Modifying documents
module.exports.updateDocuments = function (keys, params, callback) {
  const query_conditions = {
    title: keys.title,
    submission_date: keys.submission_date,
    description: keys.description,
    archived: false //only non archived documents may be modified
  };

  let conditions = Object.keys(query_conditions).reduce((result, key) => {
    if (query_conditions[key]) {
      result[key] = query_conditions[key];
    }
    else if (key == 'archived' && query_conditions[key] != undefined) result[key] = query_conditions[key];
    return result;
  }, {});

  if (conditions.submission_date != undefined) conditions.submission_date = moment(conditions.submission_date).format("YYYY-MM-DD");
  if (keys.tags != undefined) conditions.tags = { $all: keys.tags };
  // subjects are part of primary key
  conditions.subjects = keys.subjects;

  const query = {
    title: params.title,
    submission_date: params.submission_date,
    description: params.description,
    subjects: params.subjects,
    archived: params.archived,
    tags: params.tags
  }

  let update_params = Object.keys(query).reduce((result, key) => {
    if (query[key]) {
      result[key] = query[key];
    }
    else if (key == 'archived' && query[key] != undefined) result[key] = query[key];
    return result;
  }, {});

  if (update_params.submission_date != undefined) update_params.submission_date = moment(update_params.submission_date).format("YYYY-MM-DD");

  let set_param = {
    $set: update_params
  };

  // If we are changing subjects
  if (update_params.subjects != undefined) {
    Subject.RemoveDocument(conditions.subjects, conditions.title, (err, data) => {
      if (err) throw err;
      else {
        Doc.updateMany(conditions, set_param, callback);
      }
    });
  }

  else {
    Doc.updateMany(conditions, set_param, callback);
  }

};

module.exports.DeleteDocument = function (title, subjects, callback) {
  Subject.RemoveDocument(subjects, title, (err, data) => {
    if (err) throw err;
    else {
      Doc.deleteOne({ title: title, subjects: { $all: subjects } }, callback);
    }
  });
}

module.exports.SubjectRemoved = function (subject, callback) {
  Doc.deleteMany({ subjects: subject, subjects: { $size: 1 } }, (err, data) => {
    if (err) throw err;
    else {
      Doc.updateMany({ subjects: subject }, { $pull: { subjects: { $all: subject } } }, callback);
    }
  });
}

module.exports.SubjectChangedDocuments = function (titles_old, titles_new, subject, callback) {
  Doc.updateMany({ title: { $in: titles_old } }, { $pull: { subjects: { $all: subject } } }, (err, data) => {
    if (err) throw err;
    else Doc.updateMany({ title: { $in: titles_new } }, { $addToSet: { subjects: subject } }, callback);
  });
}

module.exports.addNewDocument = function (newDocument, callback) {
  let titles = [newDocument.title];
  // Waiting is not needed
  Subject.addDocument(newDocument.subjects, titles, (err, data) => {
    if (err) throw err;
    else {
      newDocument.save(callback);
    }
  });
}
