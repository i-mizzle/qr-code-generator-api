const response = require("../app/responses");
const userHelper = require("../app/helper/user");

module.exports = async (req, res, next) => {
    let user = await userHelper.find({ _id: req.user.id });
    if(user.confirmed){
        next();
    } else {
        return response.conflict(res, {message: "Sorry, You cannot perform this action till you confirm your email"})
    }
  };