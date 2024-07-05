export default class webRTC {
  public peer!: RTCPeerConnection
  constructor() {
    this.init()
  }
  private init() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    })
  }
  // 获取并设置本地sdp
  getAndsetOffer() {
    return new Promise((resolve) => {
      this.peer.createOffer().then(async (offer: RTCSessionDescriptionInit) => {
        await this.peer.setLocalDescription(offer)
        resolve(offer)
      })
    })
  }
  // 远程sdp
  getAndsetAnswer() {
    return new Promise((resolve) => {
      this.peer.createAnswer().then(async (answer) => {
        await this.peer.setLocalDescription(answer)
        resolve(answer)
      })
    })
  }
  // 设置远程sdp
  setRemoteDescription(type: 'offer' | 'answer', sdp: string) {
    return this.peer.setRemoteDescription({ type: type, sdp: sdp })
  }

  // 设置ice候选
  addIceCandidate(ice: RTCIceCandidateInit | undefined) {
    return new Promise(async () => {
      await this.peer.addIceCandidate(new RTCIceCandidate(ice))
    })
  }
  // 获取ice
  onicecandidate() {
    return new Promise((resolve) => {
      this.peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          resolve(event.candidate)
        }
      }
    })
  }

  //
  getstatus() {
    this.peer.getStats().then((stats) => {
      // 遍历所有统计报告
      stats.forEach((report) => {
        console.log(`报告名称: ${report.id}`)
        console.log(`报告类型: ${report.type}`)
        console.log(`报告统计: ${report.stat}`)

        // 举例：打印本地和远程的可用带宽估计
        if (report.id === 'bweforvideo') {
          console.log(`本地带宽估计: ${report.stat.bandwidthEstimation}`)
        } else if (report.id === 'bweforaudio') {
          console.log(`音频带宽估计: ${report.stat.bandwidthEstimation}`)
        }
      })
    })
  }
}
