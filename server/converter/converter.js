const moment = require('moment');
const {round} = require('lodash');

const convert = (number, unit) => {
    const seconds = round(moment.duration(number, unit).asSeconds(),2);
    const minutes = round(moment.duration(number, unit).asMinutes(),2);
    const hours = round(moment.duration(number, unit).asHours(),2);
    const days = round(moment.duration(number, unit).asDays(),2);
    const weeks = round(moment.duration(number, unit).asWeeks(),2);
    const months = round(moment.duration(number, unit).asMonths(),2);
    const years = round(moment.duration(number, unit).asYears(),2);
    
    let results = {seconds,minutes,hours,days,weeks,months,years}
    delete results[unit]
    return results
  };

  module.exports = {convert};
