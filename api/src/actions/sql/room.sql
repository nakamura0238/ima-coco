# createRoom
# getRoomInfo
# getJoinRoomInfo
# joinRoom
# getStateList


# ルーム作成
DROP PROCEDURE IF EXISTS createRoom;
DELIMITER //
CREATE PROCEDURE createRoom(IN input_roomName varchar(32), IN input_roomId varchar(191), IN input_userId int(11))
  BEGIN
    DECLARE createRoomId int(11);
    DECLARE firstState int(11);

    # INSERT rooms
    INSERT INTO
      rooms (roomName, roomId)
    VALUES
      (input_roomName, input_roomId);
    SET createRoomId = LAST_INSERT_ID();

    # INSERT room_user
    INSERT INTO
      room_user (userId, roomId)
    VALUES
      (input_userId, LAST_INSERT_ID());

    # 登録されている最初のstate
    SELECT
      state_data.id
    INTO firstState
    FROM state_data
    WHERE 
      state_data.userId = input_userId
      AND delete_flg IS FALSE
    LIMIT 1;

    # INSERT states
    INSERT INTO states (comment, roomUserId, stateDataId) VALUES ("", LAST_INSERT_ID(), firstState);

    # UPDATE state_data
    UPDATE state_data
    SET 
      state_data.busy = TRUE
    WHERE
      state_data.id = firstState;
    SELECT createRoomId;
  END//
DELIMITER ;


# ルーム一覧取得
DROP PROCEDURE IF EXISTS getRoomList;
DELIMITER //
CREATE PROCEDURE getRoomList(IN input_id int(11))
  BEGIN
    SELECT
        rooms.id
        , rooms.roomName
        , rooms.roomId
    FROM
        users
    INNER JOIN room_user
        ON users.id = room_user.userId
    INNER JOIN rooms
        ON room_user.roomId = rooms.id
    WHERE
        users.id = input_id
        AND room_user.delete_flg = FALSE
        AND rooms.delete_flg = FALSE;
  END//
DELIMITER ;


# ルーム情報取得
DROP PROCEDURE IF EXISTS getRoomInfo;
DELIMITER //
CREATE PROCEDURE getRoomInfo(IN input_roomId int(11))
  BEGIN
    SELECT
      rooms.id
      , rooms.roomName
      , rooms.roomId
    FROM rooms
    WHERE
      rooms.id = input_roomId;
  END//
DELIMITER ;


# 参加ルーム情報取得
DROP PROCEDURE IF EXISTS getJoinRoomInfo;
DELIMITER //
CREATE PROCEDURE getJoinRoomInfo(IN input_roomId varchar(191), IN input_userId int(11))
  main:BEGIN

    DECLARE joinRoomId varchar(191);
    DECLARE existRoom varchar(191);

    -- ルームが存在しない
    SELECT rooms.roomId
    INTO existRoom
    FROM rooms
    WHERE rooms.roomId = input_roomId;

    IF existRoom IS NULL THEN
      SELECT 
        0 as moveTo,
        "参加可能なルームが存在しません" as message;
      LEAVE main;
    END IF;

    -- すでに参加済みのルーム
    SELECT rooms.roomId
    INTO joinRoomId
    FROM rooms
    INNER JOIN room_user
      ON rooms.id = room_user.roomId
    WHERE
      rooms.roomId = input_roomId
      AND room_user.userId = input_userId
      AND room_user.delete_flg = FALSE;
    
    IF joinRoomId IS NOT NULL THEN
      SELECT 
        rooms.id as moveTo,
        "参加済みのルームです" as message
      FROM rooms
      WHERE
        rooms.roomId = input_roomId;
      LEAVE main;
    END IF;

    -- 参加先ルーム情報
    SELECT rooms.*
    FROM rooms
    WHERE
      rooms.roomId = input_roomId;

  END//
DELIMITER ;


# ルーム参加
DROP PROCEDURE IF EXISTS joinRoom;
DELIMITER //
CREATE PROCEDURE joinRoom(IN input_roomId varchar(191), IN input_userId int(11))
  BEGIN
    DECLARE deletedID int(11);
    DECLARE joinRoomId int(11);
    DECLARE firstState int(11);

      SELECT rooms.id INTO joinRoomId FROM rooms WHERE rooms.roomId = input_roomId;
      SELECT state_data.id Into firstState FROM state_data WHERE state_data.userId = input_userId LIMIT 1;

    # 過去に参加していた
    SELECT room_user.id
    INTO deletedID
    FROM room_user 
    WHERE
      room_user.roomId = joinRoomId
      AND room_user.userId = input_userId
      AND room_user.delete_flg = TRUE;

    IF deletedID IS NULL THEN
      -- SELECT rooms.id INTO joinRoomId FROM rooms WHERE rooms.roomId = input_roomId;
      INSERT INTO room_user (userId, roomId) VALUES (input_userId, joinRoomId);
      -- SELECT state_data.id Into firstState FROM state_data WHERE state_data.userId = input_userId LIMIT 1;
      INSERT INTO states (comment, roomUserId, stateDataId) VALUES ("", LAST_INSERT_ID(), firstState);
    ELSE
      SELECT state_data.id Into firstState FROM state_data WHERE state_data.userId = input_userId LIMIT 1;
      UPDATE room_user
      INNER JOIN states
      ON room_user.id = states.roomUserId
      SET
        room_user.delete_flg = 0,
        states.stateDataId = firstState,
        states.delete_flg = 0
      WHERE
        room_user.roomId = joinRoomId
        AND room_user.userId = input_userId;
    END IF;
    SELECT joinRoomId;
  END//
DELIMITER ;

# ルーム退出
DROP PROCEDURE IF EXISTS leaveRoom;
DELIMITER //
CREATE PROCEDURE leaveRoom(IN input_roomId varchar(191), IN input_userId int(11))
  BEGIN
    DECLARE leaveRoomId int(11);

    UPDATE rooms
    INNER JOIN room_user
    ON rooms.id = room_user.roomId
    INNER JOIN states
    ON room_user.id = states.roomUserId
    SET 
      room_user.delete_flg = 1,
      states.delete_flg = 1
    WHERE
      rooms.roomId = input_roomId
      AND room_user.userId = input_userId;

  END//
DELIMITER ;


# stateリスト取得
DROP PROCEDURE IF EXISTS getStateList;
DELIMITER //
CREATE PROCEDURE getStateList(IN input_roomId int(11))
  BEGIN
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
      AND room_user.delete_flg = FALSE
  END//
DELIMITER ;


# 参加しているかチェック
DROP PROCEDURE IF EXISTS checkJoinRoom;
DELIMITER //
CREATE PROCEDURE checkJoinRoom(IN input_roomId int(11), IN input_userId int(11))
  BEGIN
    SELECT
      *
    FROM
      room_user
    WHERE
      room_user.roomId = input_roomId
      AND room_user.userId = input_userId
      AND room_user.delete_flg = FALSE;
  END//
DELIMITER ;
