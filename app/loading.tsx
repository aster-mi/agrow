import LoadingAnime from "./components/LoadingAnime";

export default function Loading() {
  return (
    <div
      className="absolute left-0 top-0 flex justify-center items-center backdrop-blur w-full h-full"
      style={{ zIndex: 1200 }}
      aria-label="読み込み中"
    >
      <LoadingAnime />
    </div>
  );
}
