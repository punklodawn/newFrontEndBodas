'use client'
import { useState, useRef, useEffect } from 'react'
import { SkipBack, SkipForward, Play, Pause } from 'lucide-react'

interface Song {
  title: string
  artist: string
  videoId: string
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [player, setPlayer] = useState<any>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  const playlist: Song[] = [
    {
      title: "Canon in D \\ Jacob's Piano",
      artist: "Johann Pachelbel",
      videoId: "1elGqARTb1Q"
    },
    {
      title: "Married Life",
      artist: "Michael Giacchino \\ Cover by Jacob's Piano",
      videoId: "npT_R6QvWvY"
    }
    // {
    //   title: "Te Esperaba",
    //   artist: "Carlos Rivera",
    //   videoId: "Rir_fuLX7HM"
    // },
    // {
    //   title: "Perfect",
    //   artist: "Ed Sheeran",
    //   videoId: "2Vv-BfVoq4g"
    // },
    // {
    //   title: "All of Me",
    //   artist: "John Legend",
    //   videoId: "450p7goxZqg"
    // },
    // {
    //   title: "A Thousand Years",
    //   artist: "Christina Perri",
    //   videoId: "rtOvBOTyX00"
    // }
  ]

  // Cargar API de YouTube
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = initializePlayer
    }

    const initializePlayer = () => {
      const newPlayer = new window.YT.Player(playerRef.current!, {
        height: '0',
        width: '0',
        videoId: playlist[currentSongIndex].videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(30)
            event.target.playVideo()
            setPlayer(event.target)
            setIsPlaying(true)
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNext()
            }
          }
        }
      })
    }

    if (!window.YT) {
      loadYouTubeAPI()
    } else {
      initializePlayer()
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [])

  // Cambiar canción cuando cambia el índice
  useEffect(() => {
    if (player) {
      player.loadVideoById(playlist[currentSongIndex].videoId)
      if (isPlaying) {
        player.playVideo()
      }
    }
  }, [currentSongIndex])

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === playlist.length - 1 ? 0 : prevIndex + 1
    )
  }

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    )
  }

  return (
    <div 
      className={`music-player fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-auto'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-nature-sage">
        <div className="flex items-center justify-between">
          <div className={`transition-all duration-300 ${isExpanded ? 'w-full' : 'w-0'} overflow-hidden`}>
            <p className="text-sm font-medium text-nature-green truncate">
              {playlist[currentSongIndex].title}
            </p>
            <p className="text-xs text-nature-sage truncate">
              {playlist[currentSongIndex].artist}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={playPrevious}
              className="p-1 hover:bg-nature-cream rounded-full transition-colors"
              aria-label="Canción anterior"
            >
              <SkipBack className="w-4 h-4 text-nature-green" />
            </button>
            <button 
              onClick={togglePlay}
              className="p-2 hover:bg-nature-cream rounded-full transition-colors"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-nature-green" />
              ) : (
                <Play className="w-6 h-6 text-nature-green" />
              )}
            </button>
            <button 
              onClick={playNext}
              className="p-1 hover:bg-nature-cream rounded-full transition-colors"
              aria-label="Siguiente canción"
            >
              <SkipForward className="w-4 h-4 text-nature-green" />
            </button>
          </div>
        </div>
        <div ref={playerRef} className="hidden" />
      </div>
    </div>
  )
}

// Declaración de tipos para la API de YouTube
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}