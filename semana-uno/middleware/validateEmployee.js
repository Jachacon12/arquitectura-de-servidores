const validateEmployeeSchema = (req, res, next) => {
  const employee = req.body;
  if (typeof employee !== 'object' || employee === null) {
    return res.status(400).json({ error: 'Invalid employee data' });
  }

  const requiredFields = ['name', 'age', 'phone', 'privileges', 'favorites', 'finished', 'badges', 'points'];
  for (let field of requiredFields) {
    if (!(field in employee)) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  if (
    typeof employee.name !== 'string' ||
    typeof employee.age !== 'number' ||
    typeof employee.privileges !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid data types for name, age, or privileges' });
  }

  if (typeof employee.phone !== 'object' || !employee.phone.personal || !employee.phone.work || !employee.phone.ext) {
    return res.status(400).json({ error: 'Invalid phone data' });
  }

  if (typeof employee.favorites !== 'object' || !employee.favorites.artist || !employee.favorites.food) {
    return res.status(400).json({ error: 'Invalid favorites data' });
  }

  if (!Array.isArray(employee.finished) || !Array.isArray(employee.badges)) {
    return res.status(400).json({ error: 'finished and badges must be arrays' });
  }

  if (!Array.isArray(employee.points) || employee.points.length === 0) {
    return res.status(400).json({ error: 'points must be a non-empty array' });
  }

  for (let point of employee.points) {
    if (typeof point !== 'object' || typeof point.points !== 'number' || typeof point.bonus !== 'number') {
      return res.status(400).json({ error: 'Invalid points data' });
    }
  }

  next();
};

module.exports = validateEmployeeSchema;
