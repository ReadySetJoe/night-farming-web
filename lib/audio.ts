import { GameState } from "./types";

// Extend window interface for webkit audio context
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Music track definitions
export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  loop: boolean;
  volume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}

// Audio context and music manager
export class MusicManager {
  private audioContext: AudioContext | null = null;
  private currentTracks: Map<string, { audio: HTMLAudioElement; gainNode: GainNode; isPlaying: boolean }> = new Map();
  private isInitialized = false;
  private masterVolume = 0.5; // Default to 50% volume
  private isEnabled = true;

  // Music track configurations
  private tracks: Record<string, MusicTrack> = {
    // Base scene music
    farm_day: {
      id: "farm_day",
      name: "Peaceful Farm",
      url: "/audio/farm-day.mp3", // You'll need to add these files
      loop: true,
      volume: 0.6,
      fadeInDuration: 2000,
      fadeOutDuration: 2000,
    },
    farm_night: {
      id: "farm_night",
      name: "Quiet Night",
      url: "/audio/farm-night.mp3",
      loop: true,
      volume: 0.5,
      fadeInDuration: 3000,
      fadeOutDuration: 3000,
    },
    town_ambient: {
      id: "town_ambient",
      name: "Village Life",
      url: "/audio/town-ambient.mp3",
      loop: true,
      volume: 0.4,
      fadeInDuration: 1500,
      fadeOutDuration: 1500,
    },
    arena_combat: {
      id: "arena_combat",
      name: "Battle Theme",
      url: "/audio/arena-combat.mp3",
      loop: true,
      volume: 0.8,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
    },
    house_interior: {
      id: "house_interior",
      name: "Cozy Home",
      url: "/audio/house-interior.mp3",
      loop: true,
      volume: 0.3,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
    },

    // Horror overlays
    horror_whispers: {
      id: "horror_whispers",
      name: "Whispers",
      url: "/audio/horror-whispers.mp3",
      loop: true,
      volume: 0.3,
      fadeInDuration: 4000,
      fadeOutDuration: 4000,
    },
    horror_ambience: {
      id: "horror_ambience",
      name: "Dark Atmosphere",
      url: "/audio/horror-ambience.mp3",
      loop: true,
      volume: 0.4,
      fadeInDuration: 5000,
      fadeOutDuration: 5000,
    },
    blood_moon: {
      id: "blood_moon",
      name: "Crimson Night",
      url: "/audio/blood-moon.mp3",
      loop: true,
      volume: 0.6,
      fadeInDuration: 2000,
      fadeOutDuration: 2000,
    },
  };

  // Initialize audio context (must be called after user interaction)
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext || AudioContext)();
      
      // Resume context if suspended (for autoplay policy)
      if (this.audioContext && this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn("Could not initialize audio context:", error);
      return false;
    }
  }

  // Set master volume (0-1)
  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all playing tracks
    this.currentTracks.forEach(track => {
      if (track.gainNode) {
        track.gainNode.gain.value = this.masterVolume;
      }
    });
  }

  // Enable/disable music
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    
    if (!enabled) {
      this.stopAllTracks();
    }
  }

  // Load and play a track
  private async loadTrack(trackId: string): Promise<void> {
    if (!this.isInitialized || !this.audioContext || this.currentTracks.has(trackId)) return;

    const trackConfig = this.tracks[trackId];
    if (!trackConfig) return;

    try {
      // Create audio element
      const audio = new Audio(trackConfig.url);
      audio.loop = trackConfig.loop;
      audio.preload = "auto";

      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0; // Start silent
      gainNode.connect(this.audioContext.destination);

      // Connect audio to web audio context
      const source = this.audioContext.createMediaElementSource(audio);
      source.connect(gainNode);

      this.currentTracks.set(trackId, {
        audio,
        gainNode,
        isPlaying: false,
      });
    } catch (error) {
      console.warn(`Could not load track ${trackId}:`, error);
    }
  }

  // Play track with fade in
  async playTrack(trackId: string, fadeDuration?: number): Promise<void> {
    if (!this.isEnabled || !this.isInitialized) return;

    await this.loadTrack(trackId);
    const track = this.currentTracks.get(trackId);
    if (!track) return;

    const trackConfig = this.tracks[trackId];
    const duration = fadeDuration ?? trackConfig.fadeInDuration;

    try {
      // Start playing
      await track.audio.play();
      track.isPlaying = true;

      // Fade in
      const startTime = this.audioContext!.currentTime;
      const targetVolume = trackConfig.volume * this.masterVolume;
      
      track.gainNode.gain.cancelScheduledValues(startTime);
      track.gainNode.gain.setValueAtTime(0, startTime);
      track.gainNode.gain.linearRampToValueAtTime(targetVolume, startTime + duration / 1000);
    } catch (error) {
      console.warn(`Could not play track ${trackId}:`, error);
    }
  }

  // Stop track with fade out
  async stopTrack(trackId: string, fadeDuration?: number): Promise<void> {
    const track = this.currentTracks.get(trackId);
    if (!track || !track.isPlaying) return;

    const trackConfig = this.tracks[trackId];
    const duration = fadeDuration ?? trackConfig.fadeOutDuration;

    if (this.audioContext) {
      const startTime = this.audioContext.currentTime;
      
      track.gainNode.gain.cancelScheduledValues(startTime);
      track.gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);
      
      // Stop audio after fade
      setTimeout(() => {
        track.audio.pause();
        track.isPlaying = false;
      }, duration);
    } else {
      track.audio.pause();
      track.isPlaying = false;
    }
  }

  // Stop all tracks
  stopAllTracks() {
    this.currentTracks.forEach((track, trackId) => {
      if (track.isPlaying) {
        this.stopTrack(trackId, 500); // Quick fade out
      }
    });
  }

  // Cross-fade between tracks
  async crossFade(fromTrackId: string, toTrackId: string, duration = 2000) {
    const fadePromises = [];
    
    if (fromTrackId && this.currentTracks.has(fromTrackId)) {
      fadePromises.push(this.stopTrack(fromTrackId, duration));
    }
    
    if (toTrackId) {
      fadePromises.push(this.playTrack(toTrackId, duration));
    }
    
    await Promise.all(fadePromises);
  }

  // Get current music state for a game state
  getDesiredMusic(gameState: GameState): { primary: string; overlays: string[] } {
    const { currentScene, gameTime, horrorState, horrorEvent } = gameState;
    
    let primary = "";
    const overlays: string[] = [];
    
    // Determine primary track based on scene
    switch (currentScene) {
      case "exterior":
        primary = gameTime.isNight ? "farm_night" : "farm_day";
        break;
      case "interior":
      case "general_store":
      case "blacksmith":
      case "cozy_house":
        primary = "house_interior";
        break;
      case "town_square":
        primary = "town_ambient";
        break;
      case "arena":
        primary = "arena_combat";
        break;
    }
    
    // Add horror overlays based on conditions
    if (horrorState.currentLevel >= 3) {
      // Whispers at night after day 3
      if (gameTime.isNight && Math.random() < 0.3) {
        overlays.push("horror_whispers");
      }
    }
    
    if (horrorState.currentLevel >= 5) {
      // General horror ambience
      overlays.push("horror_ambience");
    }
    
    // Special event music
    if (horrorEvent?.type === "blood_moon") {
      overlays.push("blood_moon");
    }
    
    return { primary, overlays };
  }

  // Update music based on game state
  async updateMusic(gameState: GameState, previousState?: GameState) {
    if (!this.isEnabled) return;

    const currentMusic = this.getDesiredMusic(gameState);
    const previousMusic = previousState ? this.getDesiredMusic(previousState) : { primary: "", overlays: [] };
    
    // Handle primary track changes
    if (currentMusic.primary !== previousMusic.primary) {
      await this.crossFade(previousMusic.primary, currentMusic.primary);
    }
    
    // Handle overlay changes
    const newOverlays = currentMusic.overlays.filter(o => !previousMusic.overlays.includes(o));
    const removedOverlays = previousMusic.overlays.filter(o => !currentMusic.overlays.includes(o));
    
    // Start new overlays
    for (const overlay of newOverlays) {
      await this.playTrack(overlay);
    }
    
    // Stop removed overlays
    for (const overlay of removedOverlays) {
      await this.stopTrack(overlay);
    }
  }
}

// Global music manager instance
export const musicManager = new MusicManager();