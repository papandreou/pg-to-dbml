const { getColumnDefault } = require('./getColumnDefault');

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