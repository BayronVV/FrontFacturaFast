const fs = require('fs');
fs.copyFileSync('public/_redirects.txt', 'build/_redirects');