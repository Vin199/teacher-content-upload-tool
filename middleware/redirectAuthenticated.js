const redirectAuth = (req, res, next) => {
  if (req.session.user) {
    return res.status(403).redirect(req.session.home);
  }
  next();
};

export default redirectAuth;
