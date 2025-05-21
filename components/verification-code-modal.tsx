"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface VerificationCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (code: string) => Promise<boolean>
  reservationId: string
}

export function VerificationCodeModal({ isOpen, onClose, onConfirm, reservationId }: VerificationCodeModalProps) {
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when the modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset the state when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setVerificationCode("")
      setVerificationStatus("idle")
      setErrorMessage("")
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (verificationCode.length !== 6) {
      setErrorMessage("O código de verificação deve ter 6 dígitos")
      return
    }

    setIsSubmitting(true)
    setVerificationStatus("idle")
    setErrorMessage("")

    try {
      const success = await onConfirm(verificationCode)
      setVerificationStatus(success ? "success" : "error")
      if (!success) {
        setErrorMessage("Código de verificação inválido. Por favor, tente novamente.")
      } else {
        // Auto close after success
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      setVerificationStatus("error")
      setErrorMessage("Ocorreu um erro ao verificar o código. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 6)
    setVerificationCode(value)

    // Reset status when typing
    if (verificationStatus !== "idle") {
      setVerificationStatus("idle")
      setErrorMessage("")
    }
  }

  // Handle the Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    } else if (e.key === "Enter" && verificationCode.length === 6 && !isSubmitting) {
      handleSubmit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        onKeyDown={handleKeyDown}
        onInteractOutside={(e) => {
          e.preventDefault()
          // Only close if not submitting
          if (!isSubmitting) {
            onClose()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogDescription>
            Digite o código de verificação de 6 dígitos fornecido pelo cliente para confirmar a reserva #{reservationId}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-full max-w-[250px]">
            <Input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Digite o código de 6 dígitos"
              value={verificationCode}
              onChange={handleInputChange}
              className="text-center text-lg tracking-widest"
              disabled={isSubmitting || verificationStatus === "success"}
            />
          </div>

          {verificationStatus === "success" && (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>Reserva confirmada com sucesso!</span>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={verificationCode.length !== 6 || isSubmitting || verificationStatus === "success"}
            className={verificationStatus === "success" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : verificationStatus === "success" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmado
              </>
            ) : (
              "Confirmar Reserva"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

