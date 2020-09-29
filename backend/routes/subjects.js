
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Subject = require('../models/subject');
var moment = require('moment');
const { route } = require('./users');

//Getter

router.post('/getsubjects', (req, res, next) => {
    Subject.getSubjects(req.body, (err, data) => {
        if(err) {
            res.json({success: false, msg: "error"});
        }
        else {
            res.json({success: true, subject: data});
        }
    });
});

// Setter
router.post('/updatesubjects', (req, res, next) => {
    Subject.updateSubjects(req.body.keys, req.body.params, (err, data) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        else{
            res.json({
                success: true,
                msg: 'Uspjesno azuriranje',
            });
        }
    });
});

// New subject
router.post('/addnewsubject', (req, res, next) => {
    Subject.getSubjects({title: req.body.title}, (err, subject) => {
        if(err){ res.json({success: false, msg: `Database error: ${err}`});}
        if(subject.length != 0) {
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