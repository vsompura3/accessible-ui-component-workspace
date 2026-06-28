"use client"
import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"

interface OtpInputProps {
  maxLength?: number
  separator?: boolean
  disabled?: boolean
}

function OtpInput({
  maxLength = 6,
  separator = true,
  disabled = false,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(maxLength).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const midpoint = Math.floor(maxLength / 2)

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1)

    const copyValues = [...values]
    copyValues[idx] = digit
    setValues(copyValues)

    if (digit && idx < maxLength - 1) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault()

      if (values[idx]) {
        setValues((prev) => {
          const copyValues = [...prev]
          copyValues[idx] = ""
          return copyValues
        })
      } else if (idx > 0) {
        setValues((prev) => {
          const copyValues = [...prev]
          copyValues[idx - 1] = ""
          return copyValues
        })
        inputRefs.current[idx - 1]?.focus()
      }
    }

    if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault()
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === "ArrowRight" && idx < maxLength - 1) {
      e.preventDefault()
      inputRefs.current[idx + 1]?.focus()
    }
  }

  return (
    <div
      className="flex gap-2"
      role="group"
      aria-label="One-time password"
      data-testid="otp-input-group"
    >
      {values.map((value, idx) => (
        <React.Fragment key={idx}>
          {separator && idx === midpoint && (
            <span
              className="flex w-6 items-center justify-center"
              aria-hidden="true"
              style={{ color: "var(--text-muted)", fontSize: 20 }}
            >
              –
            </span>
          )}
          <Input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            ref={(el) => void (inputRefs.current[idx] = el)}
            value={value}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            data-test-id={`otp-input-${idx}`}
            aria-label={`Enter OTP digit ${idx + 1}`}
            autoComplete={`${idx === 0 ? "one-time-code" : "off"}`}
            className={cn(
              `h-12 w-12 rounded-lg border text-center text-2xl! caret-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none`
            )}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default OtpInput
