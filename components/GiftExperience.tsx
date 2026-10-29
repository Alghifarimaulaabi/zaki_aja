"use client";

import React, { useState, useCallback } from "react";
import { FlowerSvgDefs } from "./FlowerSvgDefs";
import { Stars } from "./Stars";
import { Garden } from "./Garden";
import { PetalsCanvas } from "./PetalsCanvas";
import { Intro } from "./Intro";
import { Message } from "./Message";
import { AudioPlayer } from "./AudioPlayer";
import { APP_CONFIG } from "@/lib/config";

export function GiftExperience() {
  const [started, setStarted] = useState(false);

  const handleOpen = useCallback(() => {
    if (started) return;
    setStarted(true);

    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // Safe fallback
      }
    }
  }, [started]);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden select-none ${
        started ? "go" : ""
      }`}
    >
      {/* SVG filter gradients for flower stems & petals */}
      <FlowerSvgDefs />

      {/* Layer Latar Belakang */}
      <div className="bg" />
      <Stars />
      <div className="orb orb--1" />
      <div className="orb orb--2" />

      {/* Simulasi Kelopak Bunga Berjatuhan (Canvas) */}
      <PetalsCanvas started={started} />

      {/* Taman Bunga Mawar / Sakura (SVG Animasi) */}
      <Garden />

      {/* Layar Pembuka (Intro) */}
      <Intro
        helloText={APP_CONFIG.helloText}
        nameText={APP_CONFIG.nameText}
        subtitleText={APP_CONFIG.subtitleText}
        buttonText={APP_CONFIG.buttonText}
        started={started}
        onOpen={handleOpen}
      />

      {/* Pesan Romantis Setelah Bunga Mekar */}
      <Message
        started={started}
        title={APP_CONFIG.messageTitle}
        body={APP_CONFIG.messageBody}
        hint={APP_CONFIG.hintText}
      />

      {/* Audio Background Music & Sound Toggle */}
      <AudioPlayer
        started={started}
        musicSrc={APP_CONFIG.musicSrc}
        volume={APP_CONFIG.volume}
      />
    </div>
  );
}
