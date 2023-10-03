const db = require('../../db/db');

/**
 * @description Confirms the user's UUID to the request session's identifier
*/

const confirmUser = async (req, res, next) => {
  const { userUuid: user_uuid } = req.params;
  try {
    const { rows: [user] } = await db.execute('server/sql/users/getByUserUuid.sql', { user_uuid });
    if (user?.identifier === req.session?.passport?.user?.id) {
      next();
      return;
    }
  } catch(error) {
    console.log('Error confirming user: ', error);
    res.sendStatus(404);
  }
};

/**
 * Authentication check middleware
*/
const checkAuthentication = (req, res, next) => {
  console.log('hit function');
  if (req.user) {
    next();
  } else {
    res.redirect('/');
    res.end();
  }
};

module.exports = {
  confirmUser,
  checkAuthentication
};