const userAuth = (req, res, next) => {
  if (true) {
    console.log("User is Authorized");
    next();
  } else {
    console.log("User is Authorized");
  }
};
module.exports = { userAuth };
