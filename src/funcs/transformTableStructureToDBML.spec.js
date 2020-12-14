const  { getColumnType, getColumnDefault} = require('./transformTableStructureToDBML');

describe('transformTableStructureToDBML && funcs used inside of it.', () => {
  describe('getColumnType()', () => {
    it('returns same data_type as given.', () => {
      const columnType = { data_type: 'fakeColumnType'}
      const response = getColumnType(columnType);
      expect(response).toEqual(columnType.data_type)
    })
    it(`returns 'varchar' when data_type = 'character varying'.`, () => {
      const columnType = { data_type: 'character varying'}
      const response = getColumnType(columnType);
      expect(response).toEqual('varchar')
    })
    it(`returns 'number' when data_type = 'double precision'.`, () => {
      const columnType = { data_type: 'double precision'}
      const response = getColumnType(columnType);
      expect(response).toEqual('number')
    })

    it(`returns 'number' when data_type = 'timestamp with time zone'.`, () => {
      const columnType = { data_type: 'timestamp with time zone'}
      const response = getColumnType(columnType);
      expect(response).toEqual('timestamp')
    })
    it(`returns 'number' when data_type = 'timestamp without time zone'.`, () => {
      const columnType = { data_type: 'timestamp without time zone'}
      const response = getColumnType(columnType);
      expect(response).toEqual('timestamp')
    })
    it(`returns 'number' when data_type = 'time without time zone'.`, () => {
      const columnType = { data_type: 'time without time zone'}
      const response = getColumnType(columnType);
      expect(response).toEqual('timestamp')
    })
    it(`returns undefined if not given coreect object input`, () => {
      const columnType = { data: 'value of incorrect property'}
      const response = getColumnType(columnType);
      expect(response).toBeUndefined()
    })  
  })

  describe('getColumnDefault()', () => {
    it(`returns '' if '::' is in the default value string.` , () => {
      const response = getColumnDefault('nextval(some.sequence.id)::regclass', 'number');
      expect(response).toEqual('')
    })
    it(`returns '' around the default value` , () => {
      const response = getColumnDefault('some string text', 'varchar');
      expect(response).toEqual(`default: 'some string text'`)
    })
    it(`does not return '' around default value` , () => {
      const response = getColumnDefault('false', 'boolean');
      expect(response).toEqual('default: false')
    })
  })
})