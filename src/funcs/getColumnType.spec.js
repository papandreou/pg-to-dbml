const getColumnType = require('./getColumnType');

describe('getColumnType()', () => {
  it('returns same data_type as given.', () => {
    const columnType = { data_type: 'fakeColumnType' };
    const response = getColumnType(columnType);
    expect(response).toEqual(columnType.data_type);
  });

  it(`returns 'varchar' when data_type = 'character varying'.`, () => {
    const columnType = { data_type: 'character varying' };
    const response = getColumnType(columnType);
    expect(response).toEqual('varchar');
  });

  it(`returns 'number' when data_type = 'double precision'.`, () => {
    const columnType = { data_type: 'double precision' };
    const response = getColumnType(columnType);
    expect(response).toEqual('number');
  });

  it(`returns 'timestamp' when data_type = 'timestamp with time zone'.`, () => {
    const columnType = { data_type: 'timestamp with time zone' };
    const response = getColumnType(columnType);
    expect(response).toEqual('timestamp');
  });

  it(`returns 'timestamp' when data_type = 'timestamp without time zone'.`, () => {
    const columnType = { data_type: 'timestamp without time zone' };
    const response = getColumnType(columnType);
    expect(response).toEqual('timestamp');
  });

  it(`returns 'timestamp' when data_type = 'time without time zone'.`, () => {
    const columnType = { data_type: 'time without time zone' };
    const response = getColumnType(columnType);
    expect(response).toEqual('timestamp');
  });

  it(`returns undefined if argument object does not have property 'data_type'`, () => {
    const columnType = { not_data_type: 'value of incorrect property' };
    const response = getColumnType(columnType);
    expect(response).toBeUndefined();
  });
});
