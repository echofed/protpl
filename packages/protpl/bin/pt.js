#!/usr/bin/env node
'use strict';
const { ProTpl } = require('../dist');
const ptl = new ProTpl(process.argv);
ptl.start();
