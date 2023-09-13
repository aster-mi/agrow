"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { NextPage } from "next";

const Login: NextPage = () => {
  // sessionには、以下のような値が入っています。
  // {
  //     "user":{
  //        "name":"John",
  //        "email":"john@examle.com",
  //        "image":"https://lh3.googleusercontent.com/a/AGNmyxZF7jQN_YTYVyxIx5kfdo3kalfRktVD17GrZ9n=s96-c"
  //     },
  //     "expires":"2023-04-01T00:29:51.016Z"
  // }
  const { data: session } = useSession();

  return (
    <>
      {
        // セッションがある場合、ログアウトを表示
        session && (
          <div className="flex items-center h-screen">
            <div className="mx-auto">
              <h1>ようこそ, {session.user && session.user.name} さん</h1>
              <h2>email: {session.user && session.user.email}</h2>
              <h2>public id: @{session.user && session.user.publicId}</h2>

              <img
                src={session.user?.image || ""}
                alt="Image"
                className="rounded-full w-32 h-32"
              ></img>
              <button onClick={() => signOut()}>ログアウト</button>
            </div>
          </div>
        )
      }
      {
        // セッションがない場合、ログインを表示
        // ログインボタンを押すと、ログインページに遷移する
        !session && (
          <div>
            <p>ログインしていません</p>
            <button onClick={() => signIn()}>ログイン</button>
          </div>
        )
      }
    </>
  );
};

export default Login;
