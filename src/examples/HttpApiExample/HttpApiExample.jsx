import { Button } from '@audius/stems'
import React, { useCallback, useEffect, useState } from 'react'

import './HttpApiExample.css'

/** HTTP API Example */

const selectHost = async () => {
  const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const res = await fetch('https://api.audius.co')
  const hosts = await res.json()
  return sample(hosts.data)
}

const HttpApiExample = () => {
  const [track, setTrack] = useState(null)
  const [host, setHost] = useState(null)

  useEffect(() => {
    const fetchTrack = async () => {
      const selectedHost = await selectHost()
      const res = await fetch(`${selectedHost}/v1/tracks/trending?limit=1&timeRange=week`)
      const json = await res.json()
      const topTrack = json.data[0]
      setHost(selectedHost)
      setTrack(topTrack)
    }
    fetchTrack()
  }, [])

  const [audio, setAudio] = useState(null);
  useEffect(() => {
    if (track) {
      console.log(track)
      const id = track.id;
      const streamUrl = `${host}/v1/tracks/${id}/stream`
      const audio = new Audio(streamUrl)
      setAudio(audio)
//      audio.play()
    }
  }, [track])

  const onPlay = useCallback(()=> {
    if(audio) {
      audio.play()
    }
  }, [audio])

  return track && (
    <div className="topTrack">
      <div className="artwork">
        <img src={track.artwork['150x150']} alt='artwork' />
      </div>
      <div className="title">
        { track.title }
      </div>
      <div className="artist">
        { track.user.name }
      </div>
      <Button 
        text='Play Track'
        onClick={onPlay}
        />
    </div>
  )
}


export default HttpApiExample