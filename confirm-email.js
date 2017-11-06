// Copyright (c) 2017 NewRedo Ltd.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

"use strict";

const express = require("express");
const path = require("path");
const multer = require("multer");
const moment = require("moment");
const url = require("url");
const querystring = require("querystring");
const toMarkdown = require("to-markdown");
const pug = require("pug");
const FormParser = require("./form-parser");
const utils = require("./utils");
const async = require("async");

module.exports = function(options) {

    var app = express.Router();

    app.get("/", function(req, res, next) {
        if (!req.query.token) {
            res.status(401, "Bad request").end();
        }
        const payload = utils.decodeToken(req.query.token, req.secret);
        if (!payload) {
            res.status(401, "Bad request").end();
        }
        options.service.confirmEmailAddress(payload, (err, user) => {
            if (!err) {
                req.user = user;
                utils.renewCookie(req, res);
            }
            next(err);
        });
    });

    app.get("/", function(req, res, next) {
        res.redirect(req.query["return-url"]);
    });

    return app;
};
