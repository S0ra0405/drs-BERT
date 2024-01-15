/**
const fs = require('fs');
var formatCSV = '';

function exportCSV(content){
    for (var i = 0; i < content.length; i++) {
        var value = content[i];
  
        for (var j = 0; j < value.length; j++) { var innerValue = value[j]===null?'':value[j].toString(); var result = innerValue.replace(/"/g, '""'); if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
        if (j > 0)
        formatCSV += ',';
        formatCSV += result;
      }
      formatCSV += '\n';
    }
    fs.writeFile('formList.csv', formatCSV, 'utf8', function (err) {
      if (err) {
        console.log('保存できませんでした');
      } else {
        console.log('保存できました');
      }
    });
  }
  */


var arr_edgelist = [];
function outEdgesinfo(){
    let edgelist = getEdges(main_network);
    arr_edgelist.push(edgelist);
    console.log(arr_edgelist);
}

/**F12画面で最後の配列を右クリック→CopyObject→pythonでcsv出力 */

/**
function outEdgescsv(){
    exportCSV(arr_edgelist);
}
*/