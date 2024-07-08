<template>
  <div class="videoChat">
    <header ref="head" class="head">
      <!-- <div class="timer">{{ (timer, isPhone) }}</div> -->
      <div class="timer">"发起"{{ isPhone }}</div>
      <windowSetting is-mini-mize is-max-imize class="setting" />
    </header>
    <section>
      <div class="videoList">
        <video ref="selfVideo" class="seleVideo" autoplay></video>
        <video ref="friendVideo" autoplay class="friendVideo"></video>
      </div>
    </section>

    <footer>
      <div class="operate">
        <el-popover>
          <template #reference>
            <div class="operateItem" @click="isCloseAudio">
              <el-button :icon="Microphone" type="primary">关闭麦克风</el-button>
            </div>
          </template>
        </el-popover>

        <div class="operateItem">
          <el-button :icon="VideoCamera" @click="isCloseViseo" type="primary">关闭视频</el-button>
        </div>
        <div v-if="isPhone !== 'true' && !isCall" class="operateItem" @click="reply">
          <el-button type="primary">接听</el-button>
        </div>
        <div class="operateItem" @click="hangUp">
          <el-button :icon="Iphone" type="danger">挂断</el-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import windowSetting from '../../components/windowSetting/index.vue'
import useDrag from '../../hooks/useDrag'
import { useMediaDevicesStore } from '../../store'
import webRTC from '../../webrtc'
import socket from '../../websocket'
import { useRoute } from 'vue-router'
import phoneMusic from '../../assets/audio/phoneMusic.mp3'
import { Iphone, VideoCamera, Microphone } from '@element-plus/icons-vue'
import useCloseWindow from '../../hooks/useCloseWindow'
// import useRecordTime from '../../hooks/useRecordTime'
const route = useRoute()
const chatRoom = route.params.room
const isPhone = route.params.isPhone
const room = (chatRoom as string) + '-' + 'video'
const mediaStore = useMediaDevicesStore()
const constraints = mediaStore.constraints
const timer = ref('00:00:00')
const head = ref<HTMLElement>()
const selfVideo = ref()
const friendVideo = ref()
const offerPeerList = ref()
const reciverPeerList = ref()
const offerPeer = ref()
const reciverPeer = ref()
const isCall = ref(false)
socket.connect()
socket.emit('join_room', room)
const stream = ref()
let clearDrag
onMounted(() => {
  clearDrag = useDrag(head.value)
})
onBeforeUnmount(() => {
  clearDrag()
})
const audio = new Audio(phoneMusic)
// 接听电话
const reply = () => {
  socket.emit('answer', room)
  audio.pause()
  answer()
  isCall.value = true
  // timer.value = useRecordTime()
}
// 挂断
const hangUp = () => {
  socket.emit('hang_up', room)
  // if (isPhone !== 'true') {
  //   reciverPeer.value.close()
  // } else {
  //   offerPeer.value.close()
  // }
  useCloseWindow()
}
//监听对面挂断
socket.on('hangUp', () => {
  window.close()
})
// 监听对面同意通话
socket.on('agreePhone', () => {
  // timer.value = useRecordTime()
  call()
})

const isCloseAudio = () => {
  stream.value.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled
  })
}

const isCloseViseo = () => {
  stream.value.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled
  })
}

const call = () => {
  try {
    offerPeer.value = new webRTC()
    offerPeer.value.peer.addTransceiver('audio', { direction: 'sendrecv' })
    offerPeer.value.peer.addTransceiver('video', { direction: 'sendrecv' })
    offerPeer.value.onicecandidate().then((ice: RTCIceCandidate) => {
      // 收集ice,并发送;
      socket.emit('sendIce', room, JSON.stringify(ice))
    })
    offerPeer.value.getAndsetOffer().then((offer: RTCSessionDescriptionInit) => {
      socket.emit('sendSdp', room, JSON.stringify(offer.sdp))
    })
    // 接收ice
    socket.on('ice', (ice) => {
      offerPeer.value.addIceCandidate(JSON.parse(ice))
    })
    // 接收sdp
    socket.on('sdp', (sdp) => {
      offerPeer.value.setRemoteDescription('answer', JSON.parse(sdp))
    })

    // offerPeerList.value.push(offerPeer)
    // 接收视频流
    const offerStream = new MediaStream()
    offerPeer.value.peer.ontrack = (event) => {
      offerStream.addTrack(event.track)
      friendVideo.value.srcObject = offerStream
    }
    stream.value.getTracks().forEach(async (track) => {
      await offerPeer.value.peer.addTrack(track, stream.value)
    })
    //  60秒后自动挂断
    setTimeout(() => {
      hangUp()
    }, 60000)
  } catch (error) {
    console.log(error)
  }
}

const answer = () => {
  reciverPeer.value = new webRTC()

  // 接收sdp,返回给对面sdp
  socket.on('sdp', (sdp) => {
    reciverPeer.value.setRemoteDescription('offer', JSON.parse(sdp))
    reciverPeer.value.getAndsetAnswer().then((answer: RTCSessionDescriptionInit) => {
      socket.emit('sendSdp', room, JSON.stringify(answer.sdp))
    })
  })
  //接收ice
  socket.on('ice', (ice) => {
    reciverPeer.value.addIceCandidate(JSON.parse(ice))
  })

  //给对面ice
  reciverPeer.value.onicecandidate().then((ice: RTCPeerConnectionIceEvent) => {
    socket.emit('sendIce', room, JSON.stringify(ice))
  })
  //
  const receiveStream = new MediaStream()

  reciverPeer.value.peer.ontrack = (event) => {
    receiveStream.addTrack(event.track)
    friendVideo.value!.srcObject = receiveStream
  }
  // 发送视频流
  stream.value.getTracks().forEach(async (track) => {
    reciverPeer.value.peer.addTrack(track, stream.value)
  })
}

onMounted(async () => {
  if (isPhone !== 'true') {
    audio.play()
  }
  stream.value = await navigator.mediaDevices.getUserMedia({
    video: constraints.video,
    audio: constraints.audio
  })
  console.log(stream.value)
  selfVideo.value.srcObject = stream.value
})
onBeforeUnmount(() => {
  window.close()
})
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
