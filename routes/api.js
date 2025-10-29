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
      const query = { ...req.query };

      // Converter 'open' de string para boolean
      if (query.open !== undefined) {
        if (query.open === 'true') query.open = true;
        else if (query.open === 'false') query.open = false;
      }

      try {
        const issues = await Issue.find({ project, ...query }).exec();
        return res.json(issues);

      } catch (err) {
        console.error(err);
        return res.json({ error: "could not fetch issues" });
      }

    })

    .put(async function (req, res) {
      let project = req.params.project;

      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      let { open } = req.body;

      if (!_id) return res.json({ error: "missing _id " });

      const updateFields = {};

      if (issue_title) updateFields.issue_title = issue_title;
      if (issue_text) updateFields.issue_text = issue_text;
      if (created_by) updateFields.created_by = created_by;
      if (assigned_to) updateFields.assigned_to = assigned_to;
      if (status_text) updateFields.status_text = status_text;
      if (open !== undefined) {
        updateFields.open = open === 'true' || open === true ? true : false;
      } 

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      updateFields.updated_on = new Date();

      try {
        const updated = await Issue.findByIdAndUpdate(_id, updateFields, { new: true });
        if (!updated) return res.json({ error: 'could not update', _id });
        return res.json({ result: 'successfully updated', _id });
      } catch (err) {
        console.error(err);
        return res.json({ error: 'could not update', _id });
      }
    })

    .delete(async function (req, res) {
      const { _id } = req.body;

      if (!_id) return res.json({ error: 'missing _id' });

      try {
        const deleted = await Issue.findByIdAndDelete(_id);
        if (!deleted) return res.json({ error: 'could not delete', _id });
        return res.json({ result: 'successfully deleted', _id });
      } catch (err) {
        console.error(err);
        return res.json({ error: 'could not delete', _id });
      }
    })

};
