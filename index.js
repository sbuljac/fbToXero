const moment = require('moment')
const fs = require('fs')
const argv = require('optimist').argv
const csv = require('csv')

fs.createReadStream(argv._[0])
  .pipe(csv.parse({ columns: true, relax_column_count: true }))
  .pipe(csv.transform((record) => {
    const md = moment(record.data)
    return {
      Date: md.format('MM/DD/YYYY'),
      Reference: md.format('YYYYMMDD-HHmm'),
      Amount: record.amountAfterCharges,
      Description: record.myRef,
      Payee: record['relatedParty.account.alias'],
      'Transaction Type': record.type,
      'Tax Type': 'No Tax'
    }
  }))
  .pipe(csv.stringify({ header: true }))
  .pipe(fs.createWriteStream(`${argv._[0].split('.')[0]}_formated.csv`))
