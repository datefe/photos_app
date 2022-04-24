const { format } = require('date-fns');

function formatDateToDB(date) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
}

module.exports = { formatDateToDB };
