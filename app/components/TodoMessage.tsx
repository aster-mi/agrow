import Link from "next/link";

const TodoMessage = () => {
  return (
    <div className="h-screen flex flex-col justify-center text-center">
      <div>こちらのページは現在実装中です。</div>
      <div>大変ご迷惑をお掛けいたします🙇‍♂️</div>
      <Link href={"/"} className="rounded bg-white text-black p-3 m-10">
        Topへ戻る
      </Link>
    </div>
  );
};
export default TodoMessage;
