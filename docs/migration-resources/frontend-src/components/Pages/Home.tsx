import type { FC } from 'react'
import { memo } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'

import { PrimaryButton } from '@/components/Elements/Button'
import { Head } from '@/components/Head'
import { Header } from '@/components/Layout'
import { useSignedInUser } from '@/features/auth'
import { GuestSignInButton } from '@/features/auth/components/atoms/GuestSignInButton'

export const Home: FC = memo(() => {
  const { isSignedIn } = useSignedInUser()
  const navigate = useNavigate()

  // ルートパスアクセス時にサインイン済みならリダイレクト
  if (isSignedIn) {
    return <Navigate to="/users/home" replace />
  }

  const onClickSignIn = () => {
    navigate('/auth/signin')
  }

  return (
    <>
      <Head />
      <div className="top-background relative min-h-screen">
        <Header />
        <main className="container items-center justify-center flex flex-col absolute top-1/2 left-1/2 lg:left-2/3 transform -translate-y-1/3 sm:-translate-y-1/2 -translate-x-1/2">
          <section className="items-center justify-center w-full p-8 flex flex-col">
            <div className="w-11/12 md:w-96 bg-gray-100 items-center justify-center shadow-md p-5 h-auto rounded-lg  bg-opacity-80 flex flex-col col-span-12">
              <hr className="w-48 border-2 border-solid border-indigo-500" />
              <h2 className="mt-8 sm:mt-20 text-yellow-800 text-sm sm:text-lg text-center">
                あなたにとっての一杯のコーヒー
                <br />
                探していきませんか？
              </h2>
              <h1 className="text-gray-800 text-4xl sm:text-5xl text-center my-4 font-bold logo-font">Bean Stamp</h1>
              <Link
                to="/auth/signup"
                className="text-center hover:text-gray-300 bg-yellow-800 text-white hover:bg-black w-52 my-2 sm:my-4 sm:w-56 p-2 sm:p-3 text-2xl font-medium rounded shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                登録する
              </Link>
              <div className="py-4 flex flex-col space-y-2">
                <PrimaryButton onClick={onClickSignIn} sizeClass="w-52 sm:w-56">
                  サインイン
                </PrimaryButton>
                <GuestSignInButton sizeClass="w-52 sm:w-56" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
})
