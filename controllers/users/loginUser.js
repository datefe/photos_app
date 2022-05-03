const jsonwebtoken = require("jsonwebtoken");
const updateLastLogin = require("../../db/updateLastLogin");
const checkPassword = require("../../db/checkPassword");

const { loginUserSchema } = require("../../validators/userValidators");

async function loginUser(req, res, next) {
  try {
    await loginUserSchema.validateAsync(req.body);

    const { email, password } = req.body;

    const [tokenInfo] = await checkPassword(email, password);

    await updateLastLogin(email);
    console.log(tokenInfo);

    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = loginUser;
