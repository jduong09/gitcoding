const db = require('../../db/db');

/**
 * @description Confirms the user's UUID to the request session's identifier
*/

const confirmUser = async (req, res, next) => {
  const { userUuid: user_uuid } = req.params;
  try {
    const { rows: [user] } = await db.execute('server/sql/users/getByUserUuid.sql', { user_uuid });
    if(user?.identifier === req.session?.passport?.id) {
      next();
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    console.log('Error confirming user: ', error);
    res.sendStatus(404);
  }
};

module.exports = {
  confirmUser
};