import * as React from 'react'
import { DecoratedDecodedWavType } from './common/type'
import { fftSize } from './common/constants'

const steps = 275

export interface SpectrogramProps {
  decoratedDecodedWav: DecoratedDecodedWavType
}

export interface SpectrogramState {}

export default class Spectrogram extends React.Component<
  SpectrogramProps,
  SpectrogramState
> {
  refs: any
  colors: string[]

  constructor(props: SpectrogramProps) {
    super(props)
    this.colors = this.generateColors()
  }

  public componentDidMount(): void {
    this.updateCanvas()
  }

  private generateColors(): string[] {
    const frequency = Math.PI / steps
    const amplitude = 127
    const center = 128
    const slice = Math.PI / 2 * 3.1
    const colors = []

    function toRGBString(v: number) {
      return 'rgba(' + [v, v, v, 1].toString() + ')'
    }

    for (var i = 0; i < steps; i++) {
      const v = (Math.sin(frequency * i + slice) * amplitude + center) >> 0

      colors.push(toRGBString(v))
    }

    return colors
  }

  private getColor(index: number): string {
    const mappedNum = steps - Math.atan(index * 500) / (Math.PI / 2) * steps
    return this.colors[mappedNum >> 0] || this.colors[0]
  }

  private drawFft(fft: Float32Array, x: number, y: number): void {
    const ctx = this.refs.canvas.getContext('2d')
    const width = 1
    const height = fftSize + y

    for (let i = 0; i < fftSize; i++) {
      ctx.fillStyle = this.getColor(fft[i])
      ctx.fillRect(x, height - i, width, 1)
    }
  }

  private updateCanvas(): void {
    const { decoratedDecodedWav } = this.props
    const ctx = this.refs.canvas.getContext('2d')
    decoratedDecodedWav.fftObj.fftsForAllChannels.forEach(
      (fftsForOneChannel, channelNum) => {
        fftsForOneChannel.forEach((fft: Float32Array, i: number) => {
          const x = i
          const y = channelNum * fftSize
          this.drawFft(fft, x, y)
        })
        ctx.rect(
          0,
          channelNum * fftSize,
          decoratedDecodedWav.fftObj.fftsForAllChannels[0].length,
          fftSize
        )
        ctx.stroke()
      }
    )
  }

  public render() {
    const { decoratedDecodedWav } = this.props
    console.log('decoratedDecodedWav', decoratedDecodedWav)
    return (
      <div>
        <canvas
          ref="canvas"
          width={decoratedDecodedWav.length}
          height={fftSize * decoratedDecodedWav.numberOfChannels}
        />
      </div>
    )
  }
}