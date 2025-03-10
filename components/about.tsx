"use client"

import { useState, useRef } from "react"
import { Play, Pause } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"

interface Track {
  id: number
  title: string
  genre: string
  duration: string
  image: string
  audio: string
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Dreaming Rogue - The ride of Dreams",
    genre: "Dream House",
    duration: "4:21",
    image: "/Image/sub-img-1.png",
    audio: "/audio/track1.mp3",
  },
  {
    id: 2,
    title: "Tidal Resonance",
    genre: "Nu Jazz",
    duration: "4:21",
    image: "/Image/sub-img-2.png",
    audio: "/audio/track2.mp3",
  },
  {
    id: 3,
    title: "March of the Humanity",
    genre: "Orchestral",
    duration: "4:21",
    image: "/Image/sub-img-3.png",
    audio: "/audio/track3.mp3",
  },
  {
    id: 4,
    title: "Mission complete",
    genre: "French House",
    duration: "4:21",
    image: "/Image/sub-img-4.png",
    audio: "/audio/track4.mp3",
  },
  {
    id: 5,
    title: "Shades of Gold",
    genre: "Synthpop",
    duration: "4:21",
    image: "/Image/sub-img-5.png",
    audio: "/audio/track5.mp3",
  },
]

export default function About() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = (trackId: number) => {
    if (currentTrack === trackId) {
      if (audioRef.current?.paused) {
        audioRef.current.play()
      } else {
        audioRef.current?.pause()
      }
    } else {
      setCurrentTrack(trackId)
      if (audioRef.current) {
        audioRef.current.src = tracks.find((track) => track.id === trackId)?.audio || ""
        audioRef.current.play()
      }
    }
  }

  return (
    <div className="sm:flex gap-2 items-start justify-evenly w-full sm:p-20 p-6">
      <div className="sm:w-96 sm:mr-10">
        <h3 className="text-xs text-primary font-semibold">What we do</h3>
        <h1 className="text-3xl font-semibold mt-4 mb-4 sm:w-64">Create your life&apos;s soundtrack</h1>
        <p className="sm:font-semibold text-white lg:font-light mb-8 sm:text-lg text-md">
          Imagine creating personalized music for your life: a ballad for a romantic date, a banger for a night out with
          friends, a lo-fi track for meditation, or an upbeat song for your child&apos;s birthday. If you can describe it in
          text, you can now express it in music.
        </p>
        <Button variant="outline" className="text-md">
          Create your first song
        </Button>
      </div>
      <div className="my-10 sm:my-0">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex justify-between bg-transparent gap-3 border rounded-md p-2 my-2 shadow-secondary-glow"
          >
            <div className="flex gap-3 items-center">
              <div className="sm:w-[60px] w-16">
                <Image
                  src={track.image || "/placeholder.svg"}
                  alt={`${track.title} cover`}
                  width={60}
                  height={60}
                  className="rounded-sm"
                />
              </div>
              <div className="max-w-64 sm:leading-4 leading-5 mr-8">
                <h1 className="font-semibold w-full">{track.title}</h1>
                <h3 className="sm:mt-1 text-sm">{track.genre}</h3>
              </div>
            </div>
            <div className="flex items-center sm:gap-10 sm:mx-6 mx-2 gap-2">
              <h1 className="hidden md:flex">{track.duration}</h1>
              <div
                className="flex items-center justify-center w-12 h-12 border rounded-full bg-gray-500/40 cursor-pointer"
                onClick={() => togglePlay(track.id)}
              >
                {currentTrack === track.id && !audioRef.current?.paused ? <Pause /> : <Play />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <audio ref={audioRef} />
    </div>
  )
}

