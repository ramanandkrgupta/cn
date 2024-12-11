const crypto = require('crypto');
console.log('CRON_SECRET:', crypto.randomBytes(32).toString('hex'));
console.log('ADMIN_API_KEY:', crypto.randomBytes(32).toString('hex'));