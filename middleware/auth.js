const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).redirect("/authentication-failed");
  }
  next();
};

export default auth;
