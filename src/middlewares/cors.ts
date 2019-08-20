export const cors = () => (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE')
  if (req.method === 'OPTIONS') {
    return res.send(null)
  }
  next()
}

export default cors
