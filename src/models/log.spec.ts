import log from './log'

describe('log model', () => {
  test('log list', () => {
    const result = log.find()
    expect(result.length).toBe(2)
  })
})
