"use client"

import OtpInput from "./OtpInput"

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <OtpInput maxLength={6} separator={true} />
    </div>
  )
}
