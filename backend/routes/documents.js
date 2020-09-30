const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Doc = require('../models/document');
const Subject = require('../models/subject');
var moment = require('moment');

//Getters

//New Doc
router.post('/addnewdocument', (req, res, next) => {
    let newDocument = new Doc({
        type: req.body.type,
        submission_date: moment().format("YYYY-MM-DD"),
        title: req.body.title,
        description: req.body.description,
        subjects: req.body.subjects,
        tags: req.body.tags,
        archived: false,
        version: 0
    });
    Subject.getSubjects({title: newDocument.subjects}, (err, data) => {
        // Check if the subject exists
        if(err) {
            res.json({success: false, msg: 'Failed'});
        }

        //If all subjects exist, all is good
        else if(data.length == req.body.subjects.length){
            Doc.getDocuments({title: newDocument.title, subjects: req.body.subjects}, false, (err, data) => {
                if(err) throw err;
                else if(data.length != 0){
                    data = data[0];// Array should have only 1 element
                    newDocument.version = data.version + 1;
                    data.subjects = undefined; // This field is set to undefined so that we don't trigger chain update on subjects. New document should have same subjects as the old one, so we can use its subjects as key
                    data.archived = true;
                    Doc.updateDocuments({title: newDocument.title, subjects: req.body.subjects}, data, (err, data) => {
                        if(err) throw err;
                        else{
                            Doc.addNewDocument(newDocument, (err, data) => {
                                if(err) {
                                    res.json({success: false, msg: 'Failed'});
                                }
                                else {
                                    res.json({success: true, msg: 'Uspjesno azuriran dokument'});
                                }
                            });
                        }
        
                  })
                  
                }
                else{
                    Doc.addNewDocument(newDocument, (err, data) => {
                        if(err) {
                            res.json({success: false, msg: 'Failed'});
                        }
                        else {
                             res.json({success: true, msg: 'Uspjesno azuriran dokument'});

                        }
                    });
                }
              });
        }

        // If it doesn't exist, notify client side, and remember data on client side

        else {
            let existing_subjects = [];
            for(i = 0; i < data.length; i++){
                existing_subjects[i] = data[i].title;
            }
            let difference = req.body.subjects.filter(x => !existing_subjects.includes(x));
            res.json({success: false, msg: 'Predmeti ne postoji', error_code: 1, nonexisting_subjects: difference});
        }
    
    });
    
});

//Getters

router.post('/getunarchiveddocuments', (req, res, next) => {
    Doc.getDocuments(req.body, false, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, documents: data});
        }
    });
});

router.post('/getarchiveddocuments', (req, res, next) => {
    Doc.getDocuments(req.body, true, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, documents: data});
        }
    });
});

router.post('/getalldocuments', (req, res, next) => {
    Doc.getAllDocuments(req.body, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, documents: data});
        }
    });
});

// Setter
router.post('/updatedocuments', (req, res, next) => {
    Doc.updateDocuments(req.body.keys, req.body.params, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true});
        }
    });
});

router.post('/deletedocument', (req, res, next) => {
    Doc.DeleteDocument(req.body.title, req.body.subjects, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true});
        }
    });
});

module.exports = router;