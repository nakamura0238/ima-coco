# getUserStateList
# insertUserState
# updateUserState
# deleteUserState


# 登録state取得
DROP PROCEDURE IF EXISTS getUserStateList;
DELIMITER //
CREATE PROCEDURE getUserStateList(IN input_userId int(11))
  BEGIN
    SELECT 
      state_data.id
      , state_data.state
      , state_data.busy
    FROM state_data 
    WHERE 
      state_data.userId = input_userId
      AND state_data.delete_flg = FALSE;
  END//
DELIMITER ;


# 登録state作成
DROP PROCEDURE IF EXISTS insertUserState;
DELIMITER //
CREATE PROCEDURE insertUserState(IN input_state varchar(191), IN input_userId int(11))
  BEGIN
    INSERT INTO state_data (state, common, userId) VALUES (input_state, FALSE, input_userId);
  END//
DELIMITER ;


# 登録state更新
DROP PROCEDURE IF EXISTS updateUserState;
DELIMITER //
CREATE PROCEDURE updateUserState(IN input_state varchar(191), IN input_id int(11))
  BEGIN
    UPDATE state_data
    SET
      state_data.state = input_state
    WHERE 
      state_data.id = input_id;
  END//
DELIMITER ;


# 登録state削除
DROP PROCEDURE IF EXISTS deleteUserState;
DELIMITER //
CREATE PROCEDURE deleteUserState(IN input_id int(11))
  BEGIN
    DELETE
    FROM state_data
    WHERE state_data.id = input_id;

  END//
DELIMITER ;


# state更新
DROP PROCEDURE IF EXISTS getUpdatedState;
DELIMITER //
CREATE PROCEDURE getUpdatedState(IN input_roomId int(11), IN input_userId int(11), IN input_stateDataId int(11), IN input_stateComment varchar(191))
  BEGIN

    DECLARE beforeStateId int(11);
    DECLARE busyCount int(11);

    # 現在のstateのid
    SELECT states.stateDataId
    INTO beforeStateId
    FROM states
    INNER JOIN room_user
      ON states.roomUserId = room_user.id
    WHERE
      room_user.roomId = input_roomId
      AND room_user.userId = input_userId;
    
    # UPDATE states
    UPDATE room_user
    INNER JOIN states
      ON room_user.id = states.roomUserId
    INNER JOIN state_data
      ON states.stateDataId = state_data.id
    SET
      states.stateDataId = input_stateDataId,
      states.comment = input_stateComment
    WHERE 
      room_user.roomId = input_roomId
      AND room_user.userId = input_userId;

    UPDATE state_data
    SET state_data.busy = 1
    WHERE state_data.id = input_stateDataId;
    
    # 使用状態の確認
    SELECT
      COUNT(*)
    INTO
      busyCount
    FROM states
    WHERE states.stateDataId = beforeStateId;

    IF busyCount = 0 THEN
      UPDATE state_data
      SET state_data.busy = 0
      WHERE state_data.id = beforeStateId;
    END IF;

    # 更新後のstateを取得
    SELECT
      states.comment
      , state_data.state
      , users.uid
      , users.displayName
    FROM rooms
    INNER JOIN room_user
      ON rooms.id = room_user.roomId
    INNER JOIN states
      ON room_user.id = states.roomUserId
    INNER JOIN users
      ON room_user.userId = users.id
    INNER JOIN state_data
      ON states.stateDataId = state_data.id
    WHERE
      rooms.id = input_roomId;

  END//
DELIMITER ;