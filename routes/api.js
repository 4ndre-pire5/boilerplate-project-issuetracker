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


    .get(async function (req, res) {
      let project = req.params.project;
      const query = req.query;

      try {
        const issues = await Issue.find({ project, ...query }).exec();
        return res.json(issues);

      } catch (err){
        console.error(err);
        return res.json({ error: "could not fetch issues" });
      }

    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    })

};
