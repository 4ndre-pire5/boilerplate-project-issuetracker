'use strict';

const Issue = require('../models/Issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .post(async function (req, res) {
      let project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to = "",
        status_text = ""
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      try {
        const newIssue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
        });

        const savedIssue = await newIssue.save();
        return res.json(savedIssue);

      } catch (err) {
        console.error(err);
        res.json({ error: "could not create issue" });
      }
    })


    .get(function (req, res) {
      let project = req.params.project;

    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    })

};
