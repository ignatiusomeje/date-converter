const moment = require('moment');

const convert = (number, unit) => {
    const seconds = moment.duration(number, unit).asSeconds();
    const minutes = moment.duration(number, unit).asMinutes();
    const hours = moment.duration(number, unit).asHours();
    const days = moment.duration(number, unit).asDays();
    const weeks = moment.duration(number, unit).asWeeks();
    const months = moment.duration(number, unit).asMonths();
    const years = moment.duration(number, unit).asYears();
    
    let results = {seconds,minutes,hours,days,weeks,months,years}
    delete results[unit]
    return results
  };

  module.exports = {convert};
