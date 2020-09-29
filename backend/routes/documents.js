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
        subject: req.body.subject,
        tags: req.body.tags,
        archived: false,
        version: 0
    });
    Subject.getSubjects({title: newDocument.subject}, (err, data) => {
        // Check if the subject exists
        if(err) {
            res.json({success: false, msg: 'Failed'});
        }

        //If it exists, all is good
        else if(data.length != 0){
            Doc.getDocumentByTitleAndSubjectName(newDocument.title, newDocument.subject, (err, data) => {
                if(err) throw err;
                else if(data){
                    newDocument.version = data.version + 1;
                    Doc.setArchivedDocument(newDocument.title, newDocument.subject, (err, data) => {
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
                            res.json({success: true, msg: 'Uspjesno dodat novi dokument'});
                        }
                    });
                }
              });
        }

        // If it doesn't exist, notify client side, and remember data on client side

        else {
            res.json({success: false, msg: 'Predmet ne postoji', error_code: 1});
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

module.exports = router;