export default function Page() {
  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col justify-center items-center text-white px-4">
      <header className="max-w-md text-center mb-8 px-6">
        <h1 className="text-3xl font-extrabold text-white mb-3">
          Listen to Artist Previews in 30 Seconds
        </h1>
        <p className="text-gray-400 text-lg">
          Hear quick 30-second previews of any artist’s songs. Decide fast if they’re your vibe, then add them to your playlist — no full albums, no hassle.
        </p>
      </header>

      <Card />
    </div>
  );
}
