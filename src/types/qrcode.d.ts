declare module 'qrcode' {
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

  interface QRCodeOptions {
    errorCorrectionLevel?: ErrorCorrectionLevel
    margin?: number
  }

  interface QRCodeResult {
    modules: {
      size: number
      data: Uint8Array | boolean[]
    }
  }

  const QRCode: {
    create(value: string, options?: QRCodeOptions): QRCodeResult
  }

  export default QRCode
}
