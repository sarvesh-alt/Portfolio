"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const messages = [
  "Initializing Secure Environment...",
  "Establishing Cloud Uplink (AWS/Oracle)...",
  "Verifying Security Protocols...",
  "Scanning Firewalls...",
  "Decrypting User Data...",
  "Access Granted."
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev === messages.length - 1) {
          clearInterval(timer)
          setTimeout(onComplete, 1000) // Wait a bit after "Access Granted"
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-green-500 font-mono overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Matrix-like background effect (subtle) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,transparent_24%,rgba(34,197,94,0.1)_25%,rgba(34,197,94,0.1)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.1)_75%,rgba(34,197,94,0.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(34,197,94,0.1)_25%,rgba(34,197,94,0.1)_26%,transparent_27%,transparent_74%,rgba(34,197,94,0.1)_75%,rgba(34,197,94,0.1)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
      </div>

      <div className="w-full max-w-lg p-6 relative">
        {/* Terminal Window Header */}
        <div className="mb-6 flex items-center justify-between border-b border-green-500/30 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs tracking-widest opacity-50">ROOT@SARVESH-SYSTEM:~</span>
        </div>
        
        {/* Terminal Content */}
        <div className="space-y-3 min-h-[200px]">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: i <= index ? (i === index ? 1 : 0.5) : 0,
                x: 0 
              }}
              className="flex items-center gap-3 text-sm sm:text-base"
            >
              <span className="text-green-500/50 shrink-0">{`>`}</span>
              <span className={i === index ? "text-green-400 font-bold" : "text-green-600"}>
                {msg}
              </span>
              {i === index && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block h-4 w-2 bg-green-500 ml-1 align-middle"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 h-1 w-full overflow-hidden bg-green-900/20">
          <motion.div
            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${((index + 1) / messages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="mt-2 flex justify-between text-xs text-green-500/40 font-mono">
          <span>CPU: 12%</span>
          <span>MEM: 402MB</span>
          <span>NET: SECURE</span>
        </div>
      </div>
    </motion.div>
  )
}
