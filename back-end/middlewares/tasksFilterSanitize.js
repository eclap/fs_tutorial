const tasksFilterSanitize = (req, res, next) => {
  if (req.query.start_date != null) {
    req.query.start_date = Number(req.query.start_date);
  }

  if (req.query.end_date != null) {
    req.query.end_date = Number(req.query.end_date);
  }

  if (!req.query.page) {
    req.query.page = 1;
  }
  req.query.page = Number(req.query.page);

  next();
};

module.exports = tasksFilterSanitize;
