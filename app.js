jQuery(function($){

// MOKĖJIMO GRAFIKAS SU NESIKEIČIANČIOMIS PALŪKANOMIS

  var remainingAmout = 5000; // esamas paskolos likutis
  var paymentsPerYear = 12; // įmokų skaičius per metus
  var interestRate = 12; // metinės palūkanos %
  var totalPayments = 24; // bendras įmokų skaičius
  var periodInterest = interestRate/paymentsPerYear/100; // periodo palūkanos

    // APSKAIČIUOTI MĖNESINĘ ĮMOKĄ
  function monthlyPaymentCount (p, m, i, n) {
    p = remainingAmout;
    m = paymentsPerYear;
    i = periodInterest;
    n = totalPayments;

    return (p * ((i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)));
  }

    // APSKAIČIUOTI PIRMO MOKĖJIMO PALŪKANŲ SUMĄ
  function interestPaymentCount (p, m, i) {
    p = remainingAmout;
    m = paymentsPerYear;
    i = periodInterest;

    return ( p * i );
  }

    // APSKAIČIUOTI PIRMO MOKĖJIMO KREDITO DALIES GRĄŽINIMO SUMĄ
  var monthlyPayment = Math.floor(monthlyPaymentCount() * 100) / 100;
  var interestPayment = Number(interestPaymentCount().toFixed(2));
  var principalPayment = monthlyPayment - interestPayment;

    // APSKAIČIUOTI LIKUSIUS MOKĖJIMUS
  var amount = [];
  amount.push(remainingAmout);
  var interest = [];
  interest.push(interestPayment);
  var principal = [];
  principal.push(principalPayment);

  for ( var c = 0 ; c < totalPayments-1; c++) {
    amount.push(Number((amount[c] - principal[c]).toFixed(2)));
    interest.push(Number((amount[c+1] * periodInterest).toFixed(2)));
    principal.push(Number((monthlyPayment - interest[c+1]).toFixed(2)));

    if ((amount[c] - principal[c]) < monthlyPayment) {
      principal[c+1] = amount[c+1];
    }
  }

    // APSKAIČIUOTI PASKUTINĖS ĮMOKOS SUMĄ
  var lastMonthlyPayment =
    (principal[principal.length - 1] + interest[interest.length - 1]).toFixed(2);

    // DATOS INTERVALAS
  var year = 2017;
  var month = 4;
  var day = 15;
  var startingDate = [];

  if ( month < 10 ) {
    month = '0' + month;
  }

  for (var c = 0; c < totalPayments; c++) {
    startingDate.push( year + '-' + month + '-' + day );
    month++;
    if ( month > 12) {
      month = '0' + 1;
      year = year + 1;
    } else if ( month < 10 ) {
      month = '0' + month;
    }
  }

    // SUKURTI MOKĖJIMŲ LENTELĘ
  var table = $('#result-one').children();

  for ( c = 0; c < totalPayments ; c++) {
    if ( c == totalPayments - 1 ) {
      monthlyPayment = lastMonthlyPayment;
    }
    table.append( '<tr><td>' + ( c + 1 ) + '</td>' +
                  '<td>' + startingDate[c] + '</td>' +
                  '<td>' + amount[c] + '</td>' +
                  '<td>' + principal[c] + '</td>' +
                  '<td>' + interest[c] + '</td>' +
                  '<td>' + monthlyPayment + '</td>' +
                  '<td>' + interestRate + '</td></tr>');
  }

    // KONVERTUOT Į .csv FORMATĄ:

        // SUKURTĄ LENTELĘ PAVERSTI Į MASYVĄ:
            // SURINKTI LENTELĖS DUOMENIS
  $('#result-one tr').each(function(row, tr){
      tableData = tableData
          + $(tr).find('td:eq(0)').text() + ' '
          + $(tr).find('td:eq(1)').text() + ' '
          + $(tr).find('td:eq(2)').text() + ' '
          + $(tr).find('td:eq(3)').text() + ' '
          + $(tr).find('td:eq(4)').text() + ' '
          + $(tr).find('td:eq(5)').text() + ' '
          + $(tr).find('td:eq(6)').text() + ' '
          + '\n';
  });

            // SUDĖTI DUOMENIS Į MASYVĄ
  var tableData = new Array();
  $('#result-one tr').each(function(row, tr){
    tableData[row] = {
      "Payment #" : $(tr).find('td:eq(0)').text(),
      "Payment date" :$(tr).find('td:eq(1)').text(),
      "Remaining amout" : $(tr).find('td:eq(2)').text(),
      "Principal payment" : $(tr).find('td:eq(3)').text(),
      "Interest payment" : $(tr).find('td:eq(4)').text(),
      "Total payment" : $(tr).find('td:eq(5)').text(),
      "Interest rate" : $(tr).find('td:eq(6)').text()
      }
  });
  tableData.shift();

        // KONVERTUOTI

            // MASYVĄ PAVERSTI Į EILUTĘ
  function convertArrayOfObjectsToCSV(args) {
      var result, ctr, keys, columnDelimiter, lineDelimiter, data;

      data = args.data || null;
      if (data == null || !data.length) {
          return null;
      }

      columnDelimiter = args.columnDelimiter || ',';
      lineDelimiter = args.lineDelimiter || '\n';

      keys = Object.keys(data[0]);

      result = '';
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function(item) {
          ctr = 0;
          keys.forEach(function(key) {
              if (ctr > 0) result += columnDelimiter;

              result += item[key];
              ctr++;
          });
          result += lineDelimiter;
      });

      return result;
  }
            // SUKURTI PARSIUNČIAMĄ FAILĄ
  function downloadCSV() {
      var csv = convertArrayOfObjectsToCSV({
          data: tableData
      });

      var hiddenElement = document.createElement('a');
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'Mokėjimo grafikas 1.csv';
      hiddenElement.click();
  }

  $(".download-first").click(downloadCSV)


});
