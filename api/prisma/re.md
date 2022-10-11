``` mermaid
erDiagram

users || -- || room_user : ""
rooms || -- || room_user : ""
room_user || -- || states :""
users || -- || state_data :""
states || -- || state_data :""


users {
  id int
  uid string
  password string
  display_name string
}

rooms {
  id int 
  room_name string
}

room_user {
  id int
  room_id int
  user_id int
  stateId int
  comment string
}


states {
  id int
  state_data_id int
  comment string
  room_user_id int
}

state_data {
  id int
  state_name string
  state string
  common boolean
  user_id int
}



```


- stateはデフォルトでいくつか用意しておく(commonがtrue)
- stateは共通で登録
- 更新時に登録しているルームか全体かを選択する
- state 更新時にコメントも追加できるようにする
## 
- ユーザー情報 登録
- ルーム作成
- ルーム参加・退出(delete時にルームの参加人数を確認してルームを削除)
- state crud
- state 更新