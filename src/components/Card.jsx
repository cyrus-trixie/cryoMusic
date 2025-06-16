import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowLeft, ArrowRight, Search } from 'lucide-react';

export default function Card() {
  const [songList, setSongList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInput, setTrackInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    fetchSongs('asake');
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update progress
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextSong();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current]);

  function fetchSongs(query) {
    fetch(`https://cryomusic.onrender.com/api/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setSongList(data.data);
        setCurrentIndex(0);

        if (audioRef.current) audioRef.current.pause();

        const newAudio = new Audio(data.data[0].preview);
        audioRef.current = newAudio;
        setIsPlaying(false);
        setProgress(0);
        setDuration(0);
      })
      .catch((err) => console.error('Search failed:', err));
  }

  function play() {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function pause() {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }

  function handleSearch() {
    if (trackInput.trim()) fetchSongs(trackInput);
  }

  function playFromIndex(index) {
    if (audioRef.current) audioRef.current.pause();
    const newAudio = new Audio(songList[index].preview);
    audioRef.current = newAudio;
    setCurrentIndex(index);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);
    newAudio.play();
  }

  function nextSong() {
    const next = (currentIndex + 1) % songList.length;
    playFromIndex(next);
  }

  function prevSong() {
    const prev = (currentIndex - 1 + songList.length) % songList.length;
    playFromIndex(prev);
  }

  if (songList.length === 0) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const currentSong = songList[currentIndex];
  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* Search Bar */}
      <div className="flex items-center space-x-2 bg-[#1e1e1e] p-3 rounded-xl max-w-md mx-auto mt-6 shadow-lg">
        <input
          type="text"
          placeholder="Search for a song..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          onChange={(e) => setTrackInput(e.target.value)}
        />
        <Search className="text-gray-400 hover:text-white cursor-pointer" onClick={handleSearch} />
      </div>

      {/* Music Card */}
      <div className="flex flex-col space-y-4 items-center p-4 bg-[#121212] rounded-xl shadow-lg mt-6 max-w-md mx-auto w-full">
        {/* Top Row */}
        <div className="flex items-center w-full space-x-4">
          <img
            src={currentSong.album.cover}
            alt="Album Cover"
            className="w-20 h-20 rounded-lg object-cover shadow-md"
          />
          <div className="flex flex-col text-white flex-1 truncate">
            <h1 className="text-sm md:text-base font-semibold truncate">
              {currentSong.title}
            </h1>
            <h1 className="text-sm md:text-base text-gray-400 truncate">
              {currentSong.artist.name}
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 bg-[#1db954] p-2 px-4 rounded-full shadow-inner">
          <ArrowLeft className="text-white hover:scale-125 transition-transform cursor-pointer" onClick={prevSong} />
          {isPlaying ? (
            <Pause className="text-white hover:scale-125 transition-transform cursor-pointer" onClick={pause} />
          ) : (
            <Play className="text-white hover:scale-125 transition-transform cursor-pointer" onClick={play} />
          )}
          <ArrowRight className="text-white hover:scale-125 transition-transform cursor-pointer" onClick={nextSong} />
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}
