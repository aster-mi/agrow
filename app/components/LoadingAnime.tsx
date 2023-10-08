export default function LoadingAnime() {
  return (
    <div
      className="absolute left-0 top-0 flex justify-center items-center w-full h-full"
      aria-label="読み込み中"
    >
      <div className="animate-spin h-8 w-8 bg-gray-400 rounded-xl"></div>
    </div>
  );
}
