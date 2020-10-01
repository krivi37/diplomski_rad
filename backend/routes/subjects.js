
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Subject = require('../models/subject');
const Doc = require('../models/document');
var moment = require('moment');
const { route } = require('./users');

//Getter

router.post('/getsubjects',  passport.authenticate(['worker-rule', 'employee-rule'], {session: false}), (req, res, next) => {
    Subject.getSubjects(req.body, (err, data) => {
        if (err) {
            res.json({ success: false, msg: `Database error: ${err}` });
        }
        else {
            res.json({ success: true, subject: data });
        }
    });
});

// Setter
router.post('/updatesubjects',  passport.authenticate(['worker-rule', 'employee-rule'], {session: false}), (req, res, next) => {
    // If we are modifying documents of the subject, first we have to check if the new documents exist, then, if the exist, we have to modify document subjects fields
    if (req.body.params.documents != undefined) {
        Doc.getDocuments({title: req.body.params.documents}, false, (err, data) => {
            if (data.length == req.body.params.documents.length) {
                Subject.updateSubjects(req.body.keys, req.body.params, (err, data) => {
                    if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }
                    else {
                        if (req.body.params.documents != undefined) {
                            // We have to update document subjects fields if we changed documents in subject
                            Doc.SubjectChangedDocuments(req.body.keys.documents, req.body.params.documents, req.body.keys.title, (err, data) => {
                                if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }
                                else {
                                    res.json({
                                        success: true,
                                        msg: 'Uspjesno azuriranje',
                                    });
                                }
                            });
                        }
                        else {
                            res.json({
                                success: true,
                                msg: 'Uspjesno azuriranje',
                            });
                        }
                    }
                });
            }
            else {
                let existing_documents = [];
                for (i = 0; i < data.length; i++) {
                    existing_documents[i] = data[i].title;
                }
                let difference = req.body.params.documents.filter(x => !existing_documents.includes(x));
                res.json({ success: false, msg: 'Predmeti ne postoji', error_code: 1, nonexisting_documents: difference });
            }
        });
    }
    // If we are not modifying document fields, then we just have to update the subject as is.
    else {
        Subject.updateSubjects(req.body.keys, req.body.params, (err, data) => {
            if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }
            else {

                res.json({
                    success: true,
                    msg: 'Uspjesno azuriranje',
                });

            }
        });
    }
});

// New subject
router.post('/addnewsubject',  passport.authenticate('worker-rule', {session: false}), (req, res, next) => {
    Subject.getSubjects({ title: req.body.title }, (err, subject) => {
        if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }
        if (subject.length != 0) {
            res.json({
                success: false,
                msg: 'Predmet pod tim imenom vec postoji',
            });
        }
        else {
            let newSubject = new Subject({
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
                if (err) {
                    res.json({ success: false, msg: `Database error: ${err}` });
                }
                else {
                    res.json({ success: true, msg: 'Zaveden novi predmet' });
                }
            })
        }
    });
});


router.post('/deletesubject',  passport.authenticate('worker-rule', {session: false}), (req, res, next) => {
    Doc.SubjectRemoved(req.body.title, (err, data) => {// mora ovako zbog kruznih zavisnosti Doc -> Subject i Subject -> Doc
        if (err) throw err;
        else {
            Subject.deleteOne({ title: req.body.title }, (err, data) => {
                if (err) {
                    res.json({ success: false, msg: `Database error: ${err}` });
                }
                else {
                    res.json({ success: true, msg: 'Uspjesno obrisan predmet' });
                }
            });
        }
    });
});

module.exports = router;