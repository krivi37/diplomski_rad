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
    Subject.getSubjectByTitle(newDocument.subject, (err, data) => {
        // Check if the subject exists
        if(err) {
            res.json({success: false, msg: 'Failed'});
        }

        //If it exists, all is good
        else if(data){
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

router.post('/getdocumentsbytitle', (req, res, next) => {
    Doc.getDocumentsByTitle(req.body.title, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, subjects: data});
        }
    });
});

router.post('/getdocumentbytitle_subjectname', (req, res, next) => {
    Doc.getDocumentByTitleAndSubjectName(req.body.title, req.body.subject_name, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, subject: data});
        }
    });
});

router.post('/getdocumentsbytitle_with_archived', (req, res, next) => {
    Doc.getAllDocumentsByTitleAndSubjectName(req.body.title, req.body.subject_name, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, subjects: data});
        }
    });
});

router.post('/getdocumentsbytags', (req, res, next) => {
    Doc.getDocumentsByTags(req.body.tags, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, subjects: data});
        }
    });
});

router.post('/getdocumentbytitle_subjectid', (req, res, next) => {
    Doc.getDocumentByTitleAndSubjectName(req.body.title, req.body.subject_id, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true, subject: data});
        }
    });
});

router.post('/archivedocument', (req, res, next) => {
    Doc.setArchivedDocument(req.body.title, req.body.subject, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true});
        }
    });
});

router.post('/updatedescription', (req, res, next) => {
    Doc.updateDescription(req.body.title, req.body.subject, req.body.description, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true});
        }
    });
});
 
router.post('/updatetags', (req, res, next) => {
    Doc.updateTags(req.body.title, req.body.subject, req.body.tags, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true});
        }
    });
});

router.post('/updatetitle', (req, res, next) => {
    Doc.updateTitle(req.body.title, req.body.subject, req.body.new_title, (err, data) => {
        if(err) {
            res.json({success: false, msg: "Failed"});
        }
        else {
            res.json({success: true});
        }
    });
});

module.exports = router;