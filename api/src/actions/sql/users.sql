# registeredUser
# loginUser
# signupUser
# getUserData


# 登録済みチェック
DROP PROCEDURE IF EXISTS registeredUser;
DELIMITER //
CREATE PROCEDURE registeredUser(IN input_uid varchar(191))
  BEGIN
    SELECT
      users.id,
      users.uid,
      users.displayName
    FROM users
    WHERE
      users.uid = input_uid;
  END//
DELIMITER ;


# ログイン時処理
DROP PROCEDURE IF EXISTS loginUser;
DELIMITER //
CREATE PROCEDURE loginUser(IN input_uid varchar(191), IN input_password varchar(191))
  BEGIN
    SELECT 
      users.*
    FROM users
    WHERE
      users.uid = input_uid
      AND users.password = input_password;
  END//
DELIMITER ;



# ユーザー登録
DROP PROCEDURE IF EXISTS signupUser;
DELIMITER //
CREATE PROCEDURE signupUser(IN input_uid varchar(191), IN input_password varchar(191))
  BEGIN
    INSERT INTO users (uid, password) VALUES (input_uid, input_password);
    INSERT INTO state_data (state, userId) VALUES ("空き", LAST_INSERT_ID());
  END//
DELIMITER ;


# ユーザーデータ取得
DROP PROCEDURE IF EXISTS getUserData;
DELIMITER //
CREATE PROCEDURE getUserData(IN input_userId int(11), IN input_userUId varchar(191))
  BEGIN
    SELECT 
      users.id,
      users.uid,
      users.displayName,
      users.image
    FROM users
    WHERE
      users.id = input_userId
      AND users.uid = input_userUId;
  END//
DELIMITER ;