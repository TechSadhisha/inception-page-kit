
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Play, Pause, Download, Volume2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface TextToVoicePlayerProps {
  text: string
}

export const TextToVoicePlayer = ({ text }: TextToVoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [voice, setVoice] = useState('alloy')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const voices = [
    { id: 'alloy', name: 'Alloy (Neutral)' },
    { id: 'echo', name: 'Echo (Male)' },
    { id: 'fable', name: 'Fable (British Male)' },
    { id: 'onyx', name: 'Onyx (Deep Male)' },
    { id: 'nova', name: 'Nova (Female)' },
    { id: 'shimmer', name: 'Shimmer (Female)' }
  ]

  const generateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "No text to convert",
        description: "Please enter some text first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: { text, voice }
      })

      if (error) throw error

      if (data?.audioContent) {
        // Convert base64 to blob
        const binaryString = atob(data.audioContent)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        toast({
          title: "Audio generated",
          description: "Your text has been converted to speech",
        })
      }
    } catch (error) {
      console.error('Error generating audio:', error)
      toast({
        title: "Generation failed",
        description: "Could not convert text to speech",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = 'script-audio.mp3'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      toast({
        title: "Audio downloaded",
        description: "The audio file has been saved",
      })
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="text-center">
          <h3 className="font-semibold flex items-center justify-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Text to Voice</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Convert your script to speech
          </p>
        </div>

        <div>
          <Label htmlFor="voice-select">Voice</Label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center space-x-2">
          <Button
            onClick={generateAudio}
            disabled={isGenerating || !text.trim()}
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Volume2 className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </Button>

          {audioUrl && (
            <>
              <Button variant="outline" onClick={playAudio}>
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>

              <Button variant="outline" onClick={downloadAudio}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
        )}

        <div className="text-xs text-muted-foreground text-center">
          Character count: {text.length} / 4000
        </div>
      </CardContent>
    </Card>
  )
}
