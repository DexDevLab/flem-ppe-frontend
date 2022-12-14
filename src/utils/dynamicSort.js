/**
 * Máscara de CPF. Converte String no formato "12345678900" para o CPF
 * nacional ("123.456.789-00").
 * @param {String} cpf String contendo o CPF ou um array de CPFs
 * @returns CPF ou array de CPFs devidamente formatado.
 */
export function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  if (valueType === Number) {
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      const param1 = a[property];
      const param2 = b[property];
      var result = param1 < param2 ? -1 : param1 > param2 ? 1 : 0;
      return result * sortOrder;
    };
  } else {
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      const param1 = a[property]
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const param2 = b[property]
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      var result = param1 < param2 ? -1 : param1 > param2 ? 1 : 0;
      return result * sortOrder;
    };
  }
}
