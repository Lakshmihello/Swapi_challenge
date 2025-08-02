module.exports = {
  sorter,
};

function sorter(field, objectList, direction = 'asc') {
  const allowedFields = ['mass', 'height', 'name'];
  const numberFields = ['mass', 'height'];

  if (!allowedFields.includes(field)) {
    throw new Error('invalid sort field provided. Allowed fields: ' + allowedFields.join(', '));
  }

  function parser(v) {
    const isNumberType = numberFields.includes(field);
    if (isNumberType) {
      v = parseFloat(v.toString().replace(/[^0-9\.\-]/, ''));
      if (isNaN(v)) v = 0;
    }
    return v;
  }

  objectList.sort((a, b) => {
    a = parser(a[field]);
    b = parser(b[field]);

    if (direction === 'desc') {
      return a < b ? 1 : a > b ? -1 : 0;
    }
    return a > b ? 1 : a < b ? -1 : 0;
  });
}
