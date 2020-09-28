
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Subject = require('../models/subject');
var moment = require('moment');

//Getters
router.post('/getsubjectbyid', (req, res, next) => {
    Subject.getSubjectById(req.body.id_number, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});

router.post('/getsubjectbytitle', (req, res, next) => {
    Subject.getSubjectByTitle(req.body.title, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});

router.post('/getsubjectsbydate', (req, res, next) => {
    Subject.getSubjectsByDate(req.body.date, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});

router.post('/getsubjectsbykeywords', (req, res, next) => {
    Subject.getSubjectsByKeywords(req.body.keywords, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});
router.post('/getsubjectsbycategory', (req, res, next) => {
    Subject.getSubjectsByCategory(req.body.category, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});
router.post('/getsubjectsbysubmitter', (req, res, next) => {
    Subject.getSubjectsBySubmitter(req.body.submitter, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});
router.post('/getsubjectsbydepartment', (req, res, next) => {
    Subject.getSubjectsByDepartment(req.body.department, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});
router.post('/getsubjectsbyemployees', (req, res, next) => {
    Subject.getSubjectsByEmployees(req.body.employees, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});
router.post('/getsubjectsbydocuments', (req, res, next) => {
    Subject.getSubjectsByDocuments(req.body.documents, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: true,
            msg: 'Found subject',
            subject: subject
        });
        }
    });
});

// Setters

router.post('/updatesubjecttitle', (req,res, next) => {
    Subject.updateSubjectTitle(req.body.title, req.body.new_title, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje imena',
                subject: subject
            });
        }
    });
});

router.post('/updatesubjectdescription', (req,res, next) => {
    Subject.updateSubjectDescription(req.body.title, req.body.new_description, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje opisa',
                subject: subject
            });
        }
    });
});

router.post('/updatesubjectkeywords', (req,res, next) => {
    Subject.updateSubjectKeywords(req.body.title, req.body.new_keywords, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje kljucnih rijeci',
                subject: subject
            });
        }
    });
});

router.post('/updatesubjectcategpry', (req,res, next) => {
    Subject.updateSubjectCategory(req.body.title, req.body.new_category, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje kategorije',
                subject: subject
            });
        }
    });
});

router.post('/updatesubjectemployees', (req,res, next) => {
    Subject.updateSubjectEmployees(req.body.title, req.body.new_employees, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje zaposlenih',
                subject: subject
            });
        }
    });
});

router.post('/updatesubjectdepartment', (req,res, next) => {
    Subject.updateSubjectDepartment(req.body.title, req.body.new_department, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje odsjeka',
                subject: subject
            });
        }
    });
});

// New subject
router.post('/addnewsubject', (req, res, next) => {
    Subject.getSubjectByTitle(req.body.title, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject) {
            res.json({success: false,
            msg: 'Predmet pod tim imenom vec postoji',
            subject: subject
        });
        }
        else{
            let newSubject = new Subject ({
                id_number: req.body.id_number,
                submission_date: moment().format("YYYY-MM-DD"),
                title: req.body.title,
                description: req.body.description,
                keywords: req.body.keywords,
                category: req.body.category,
                submitter: req.body.submitter,
                employees: req.body.employees,
                department: req.body.department,
                documents: []
            });

            Subject.AddSubject(newSubject, (err, subject) => {
                if(err) {
                    res.json({success: false, msg: 'Failed'});
                }
                else {
                    res.json({success: true, msg: 'Zaveden novi predmet'});
                }
            })
        }
    });
});

module.exports = router;