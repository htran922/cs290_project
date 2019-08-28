var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_tranhel',
  password        : '5862',
  database        : 'cs290_tranhel'
});
module.exports.pool = pool;