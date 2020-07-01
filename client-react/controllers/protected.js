// modules
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// server
const express = require('express')
const { Profiler } = require('react')
const { db } = require('../models/User')
const router = express.Router()

// provides a short authenticate to other get routes
const authenticate = (req, res, next) => {
  const authorization = req.header('Authorization') || ''
  const [type, token] = authorization.split(' ')
  try {
    if (type === 'Bearer' && jwt.verify(token, 'PROCESS')) { // change for depoyment
      console.log(token, 'token')
      const payload = jwt.decode(token, 'PROCESS')
      console.log(payload, 'payload')
      User.findOne({ _id: payload._id }, (err, userDoc) => { // change for deployment
        if (err) return res.status(500).send(err)
        req.user = userDoc
        console.log('authenticate ran')
        return next()
      })
    } else {
      console.log('this is the else')
      res.status(401).send('Unauthorized')
    }
  } catch (err) {
    console.log(err, 'this is the catch')
    res.status(401).send('Unauthorized')
  }
}

router.post('/profileUpdate', [authenticate], (req, res) => {
  console.log(req.user)

  const objUpdate = {}
  console.log(req.body, 'req.body is')

  if (req.body.Fname !== '') objUpdate.first_name = req.body.Fname
  if (req.body.Lname !== '') objUpdate.last_name = req.body.Lname
  if (req.body.job_title !== '') objUpdate.job_title = req.body.job_title
  if (req.body.city !== '') objUpdate.city = req.body.city
  if (req.body.county !== '') objUpdate.county = req.body.county
  if (req.body.district !== '') objUpdate.district = req.body.district

  console.log(objUpdate)
  const updates = {
    $set: objUpdate
  }

  User.updateOne({ _id: req.user }, updates, (err, res) => {
    if (err) return res.status(500).send(err)
    console.log('profile updated')
  })
})

module.exports = router
