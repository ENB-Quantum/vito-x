"use client"
import Image from "next/image"
import type React from "react"

import { useState, useRef, useEffect, type JSX } from "react"
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react"

interface Album {
  id: number
  title: string
  artist: string
  genre: string
  image: string
  audioSrc: string
}

export default function Albums(): JSX.Element {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentAlbum, setCurrentAlbum] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.7)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [showPlayer, setShowPlayer] = useState<boolean>(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  const albums: Album[] = [
    {
      id: 1,
      title: "God, are you there ?",
      artist: "DannoOppo",
      genre: "Folk",
      image: "/Image/image-1.png",
      audioSrc: "/audio/track1.mp3", // Replace with your actual audio file path
    },
    {
      id: 2,
      title: "I let you down ?",
      artist: "MrTomMusic",
      genre: "Electronic",
      image: "/Image/image-2.png",
      audioSrc: "/audio/track2.mp3",
    },
    {
      id: 3,
      title: "Friday Night Ride",
      artist: "DannoOppo",
      genre: "Hip Hop",
      image: "/Image/image-3.png",
      audioSrc: "/audio/track3.mp3",
    },
    {
      id: 4,
      title: "Pro Castinator",
      artist: "Jakemarsh",
      genre: "Rock",
      image: "/Image/image-4.png",
      audioSrc: "/audio/track4.mp3",
    },
    {
      id: 5,
      title: "Monster Monster",
      artist: "DannoOppo",
      genre: "Folk",
      image: "/Image/image-5.png",
      audioSrc: "/audio/track5.mp3",
    },
  ]

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      const audio = new Audio()
      audio.addEventListener("timeupdate", updateProgress)
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration)
      })
      audio.addEventListener("ended", () => {
        setIsPlaying(false)
      })
      audioRef.current = audio
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateProgress)
        audioRef.current.removeEventListener("loadedmetadata", () => {})
        audioRef.current.removeEventListener("ended", () => {})
      }
    }
  }, [])

  useEffect(() => {
    // Set volume when it changes or mute state changes
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const updateProgress = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handlePlay = (albumId: number): void => {
    const album = albums.find((a) => a.id === albumId)

    if (!album) return

    if (currentAlbum === albumId && isPlaying) {
      // Pause current track
      audioRef.current?.pause()
      setIsPlaying(false)
    } else if (currentAlbum === albumId && !isPlaying) {
      // Resume current track
      audioRef.current?.play()
      setIsPlaying(true)
    } else {
      // Play a new track
      if (audioRef.current) {
        audioRef.current.src = album.audioSrc
        audioRef.current.load()
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
        setCurrentAlbum(albumId)
        setIsPlaying(true)
        setShowPlayer(true) // Show the player when a new track is played
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!progressBarRef.current || !audioRef.current) return

    const progressBar = progressBarRef.current
    const rect = progressBar.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width

    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration
    }
  }

  const toggleMute = (): void => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Albums Grid */}
      <div className="sm:flex flex-wrap items-center justify-center gap-16 sm:m-20">
        {albums.map((album) => (
          <div key={album.id} className="flex items-center flex-col my-4">
            <div
              className="w-44 h-44 rounded-lg relative overflow-hidden"
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
            >
              <Image
                src={album.image || "/placeholder.svg"}
                alt={album.title}
                width={176}
                height={176}
                className={`transition-all duration-300 ${
                  hoveredAlbum === album.id || currentAlbum === album.id ? "scale-110 blur-sm" : ""
                }`}
              />
              {(hoveredAlbum === album.id || currentAlbum === album.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
                  <button
                    className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
                    onClick={() => handlePlay(album.id)}
                    aria-label={`${isPlaying && currentAlbum === album.id ? "Pause" : "Play"} ${album.title}`}
                  >
                    {isPlaying && currentAlbum === album.id ? (
                      <Pause size={28} className="text-black" />
                    ) : (
                      <Play size={28} className="text-black ml-1" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <h1 className="font-semibold text-center mt-3">{album.title}</h1>
            <h3 className="text-gray-500/60 font-semibold text-sm text-center">{album.artist}</h3>
            <h3 className="text-sm font-semibold bg-gray-500/20 rounded-full text-center px-3 mt-1">{album.genre}</h3>
          </div>
        ))}
      </div>

      {/* Audio Player Controls */}
      {currentAlbum !== null && showPlayer && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-10">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded overflow-hidden">
                <Image
                  src={albums.find((a) => a.id === currentAlbum)?.image || ""}
                  alt="Now playing"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <p className="font-medium">{albums.find((a) => a.id === currentAlbum)?.title}</p>
                <p className="text-sm text-gray-400">{albums.find((a) => a.id === currentAlbum)?.artist}</p>
              </div>
            </div>

            <div className="flex-grow flex flex-col mx-4 w-full">
              <div className="flex items-center justify-center gap-4 mb-2">
                <button
                  className="bg-white text-black rounded-full p-3 hover:bg-gray-200"
                  onClick={() => handlePlay(currentAlbum)}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full">
                <span className="text-xs">{formatTime(currentTime)}</span>
                <div
                  ref={progressBarRef}
                  className="flex-grow h-2 bg-gray-700 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs">{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-white hover:text-gray-300" onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                className="w-24 cursor-pointer"
              />
              <button className="text-white hover:text-gray-300 ml-4" onClick={() => setShowPlayer(false)}>
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

