const getColumnDefault = require('./getColumnDefault');

describe('getColumnDefault()', () => {
  it(`returns '' if '::' is in the default value string.` , () => {
    const response = getColumnDefault('nextval(some.sequence.id)::regclass', 'number');
    expect(response).toEqual('')
  })
  it(`returns '' (single quotes) around the default value, if type is 'varchar', 'character', 'char', 'text', or 'timestamp'` , () => {
    const response = getColumnDefault('some string text', 'varchar');
    expect(response).toEqual(`default: 'some string text'`)
  })
  it(`does not return '' (single quotes) around default values for non-string or non-date types` , () => {
    const response = getColumnDefault('false', 'boolean');
    expect(response).toEqual('default: false')
  })
})