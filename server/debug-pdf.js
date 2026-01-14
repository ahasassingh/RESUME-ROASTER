const pdf = require('pdf-parse');
console.log('Type of pdf export:', typeof pdf);
console.log('Is it a function?', typeof pdf === 'function');
console.log('Export keys:', Object.keys(pdf));
console.log('Export:', pdf);
