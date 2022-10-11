/* eslint-disable no-unused-vars */

type Props = {
  flg: boolean
  num: number
}

type CheckSigninResponse = {
  check: boolean
}

type AuthLoginResponse = {
  check: boolean,
  message: string,
  token: string,
}
