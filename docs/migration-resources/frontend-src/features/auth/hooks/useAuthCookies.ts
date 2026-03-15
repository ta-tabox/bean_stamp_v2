import { useCookies } from 'react-cookie'

import type { AxiosResponse } from 'axios'

export const useAuthCookies = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['uid', 'client', 'access-token'])

  const setExpireDate = (isRememberMe?: boolean) => {
    const expireDate = 14 // rememberMe期間を14日に設定
    return isRememberMe ? new Date(Date.now() + expireDate * 86400e3) : undefined
  }

  type SetAuthCookiesOptions = {
    res: AxiosResponse
    isRememberMe?: boolean
  }

  const setAuthCookies = ({ res, isRememberMe }: SetAuthCookiesOptions) => {
    const expireDate = setExpireDate(isRememberMe)
    setCookie('uid', res.headers.uid, { path: '/', expires: expireDate })
    setCookie('client', res.headers.client, { path: '/', expires: expireDate })
    setCookie('access-token', res.headers['access-token'], { path: '/', expires: expireDate })
  }

  // 認証関係のCookiesを削除 pathを指定しないと削除できない
  const removeAuthCookies = () => {
    removeCookie('uid', { path: '/' })
    removeCookie('client', { path: '/' })
    removeCookie('access-token', { path: '/' })
  }

  return { setAuthCookies, removeAuthCookies }
}
