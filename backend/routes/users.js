//User http requests 
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//Register. System admin connects to this point when creating new profiles.
router.post('/register', passport.authenticate('admin-rule', { session: false }), (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    secretQ: req.body.secretQ,
    secretA: req.body.secretA,
    type: req.body.type,
    department: req.body.department
  });

  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) { res.json({ success: false, msg: `Greska u bazi: ${err}` }); }
    if (!user) {
      User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({ success: false, msg: 'Neuspjesna registracija' });
        } else {
          res.json({ success: true, msg: 'Kreiran nalog' });
        }
      });
    }
    else if (user) {
      res.json({ success: false, msg: 'Korisnicko ime je zauzeto' });
    }

  });

});

router.post('/deleteuser', passport.authenticate('admin-rule', { session: false }), (req, res, next) => {
  User.deleteUser(req.body.username, (err, data) => {
    if (err) {
      res.json({ success: false, msg: `Database error: ${err}` });
    }
    else {
      res.json({ success: true, msg: `Upsjesno obrisan korisnik` });
    }
  });
});

router.get('/getemployees', passport.authenticate(['employee-rule', 'worker-rule'], { session: false }), (req, res, next) => {
  User.getEmployees((err, data) => {
    if (err) {
      res.json({ success: false, msg: `Database error: ${err}` });
    }
    else {
      res.json({ success: true, employees: data });
    }
  });
});

router.get('/getnonadmins', passport.authenticate('admin-rule', { session: false }), (req, res, next) => {
  User.getAllNonAdmins((err, data) => {
    if (err) {
      res.json({ success: false, msg: `Database error: ${err}` });
    }
    else {
      res.json({ success: true, users: data });
    }
  });
});

router.post('/authenticate', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }

    if (!user) {
      return res.json({ success: false, msg: 'Korisnik nije pronadjen' });
    }

    User.comparePassword(password, user.password, (error, isMatch) => {
      if (error) { res.json({ success: false, msg: `Database error: ${error}` }); }
      if (isMatch) {
        const token = jwt.sign({ _id: user._id, type: user.type }, config.secret, {
          expiresIn: 3600
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            type: user.type
          }
        });
      }

      else {
        return res.json({ success: false, msg: 'Pogresna lozinka' });
      }
    });
  });
});

// For resetting password
router.post('/forgottenpassword', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;

  User.getUserByUsername(username, (err, user) => {
    if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }

    if (!user || email != user.email) {
      return res.json({ success: false, msg: 'Korisnik sa tim korisnickim imenom i mejlom nije pronadjen' });
    }
    return res.json({ success: true, msg: 'Tajno pitanje' });
  }
  )
});

// Secret question check
router.post('/questioncheck', (req, res, next) => {
  let username = req.body.username;
  let answer = req.body.answer;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user || answer != user.secretA) {
      return res.json({ success: false, msg: 'Pogresan odgovor na tajno pitanje' });
    }
    return res.json({ success: true, msg: 'Resetuj lozinku' });
  }
  )
})

// For resetting/changing password
router.post('/resetpassword', (req, res, next) => {
  let username = req.body.username;
  let newpass = req.body.newpass;
  User.updatePassword(username, newpass, (err, user) => {
    if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }
    return res.json({ success: true, msg: 'Uspjesno postavljena nova lozinka' });
  }
  )
})

router.post('/getquestion', (req, res, next) => {
  let username = req.body.username;

  User.getUserByUsername(username, (err, user) => {
    ;
    if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }
    return res.json({ success: true, secret_question: user.secretQ });
  }
  )
})

// For changing password
router.post('/checkpassword', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.oldpass;
  User.getUserByUsername(username, (err, user) => {
    if (err) { res.json({ success: false, msg: `Database error: ${err}` }); }

    if (!user) {
      return res.json({ success: false, msg: 'Korisnik nije pronadjen' });
    }

    User.comparePassword(password, user.password, (error, isMatch) => {
      if (error) { res.json({ success: false, msg: `Database error: ${err}` }); }
      if (isMatch) {
        res.json({
          success: true,
          msg: "OK"
        });
      }
      else {
        return res.json({ success: false, msg: 'Pogresna stara lozinka' });
      }
    });
  });
})

module.exports = router;