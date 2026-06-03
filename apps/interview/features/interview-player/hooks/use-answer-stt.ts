"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionConstructor,
  type BrowserSpeechRecognition,
  type SpeechRecognitionErrorCode,
} from "@/features/interview-player/hooks/speech-recognition";

export type SttErrorCode = SpeechRecognitionErrorCode | "unsupported";

type UseAnswerSttOptions = {
  onTranscript: (text: string) => void;
  onClear: () => void;
};

export function useAnswerStt({ onTranscript, onClear }: UseAnswerSttOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [errorCode, setErrorCode] = useState<SttErrorCode | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const finalPartsRef = useRef<string[]>([]);
  const onTranscriptRef = useRef(onTranscript);
  const onClearRef = useRef(onClear);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onClearRef.current = onClear;
  }, [onTranscript, onClear]);

  useEffect(() => {
    setIsSupported(getSpeechRecognitionConstructor() !== null);
  }, []);

  const publishTranscript = useCallback((interim: string) => {
    const finals = finalPartsRef.current.join(" ").trim();
    const combined = interim ? `${finals} ${interim}`.trim() : finals;
    onTranscriptRef.current(combined);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor) {
      setErrorCode("unsupported");
      return;
    }

    stop();
    setErrorCode(null);
    finalPartsRef.current = [];
    onClearRef.current();

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalPartsRef.current.push(text);
        } else {
          interim += text;
        }
      }
      publishTranscript(interim);
    };

    recognition.onerror = (event) => {
      setErrorCode(event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      publishTranscript("");
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setErrorCode("not-allowed");
      setIsListening(false);
    }
  }, [publishTranscript, stop]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return {
    isListening,
    isSupported,
    errorCode,
    start,
    stop,
  };
}
