class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Play wooden dice rolling sound with intensity based on dice count
  async playDiceRoll(diceCount: number = 1) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;
      const baseVolume = Math.min(0.4, 0.2 + diceCount * 0.05);
      const totalDuration = 1.0 + diceCount * 0.15;

      // Number of bounces scales with dice count
      const numBounces = 5 + Math.min(diceCount * 2, 10);

      for (let bounce = 0; bounce < numBounces; bounce++) {
        // Each bounce happens progressively later with decreasing volume
        const bounceTime = now + bounce * (0.08 + Math.random() * 0.04);
        const bounceVolume = baseVolume * Math.pow(0.72, bounce);
        
        // Add variation for each "die" hitting
        const diceHits = bounce === 0 ? diceCount : Math.max(1, Math.floor(diceCount * Math.random()));
        
        for (let hit = 0; hit < diceHits; hit++) {
          const hitDelay = hit * (0.01 + Math.random() * 0.02);
          const hitTime = bounceTime + hitDelay;
          const hitVolume = bounceVolume * (0.7 + Math.random() * 0.3);

          // === DEEP WOODEN THUD ===
          // Low frequency impact - the body of the wooden sound
          const thudOsc = ctx.createOscillator();
          const thudGain = ctx.createGain();
          const thudFilter = ctx.createBiquadFilter();
          
          thudOsc.type = 'sine';
          // Vary the base frequency for natural variation
          const thudFreq = 60 + Math.random() * 30;
          thudOsc.frequency.setValueAtTime(thudFreq, hitTime);
          thudOsc.frequency.exponentialRampToValueAtTime(thudFreq * 0.5, hitTime + 0.12);
          
          thudFilter.type = 'lowpass';
          thudFilter.frequency.setValueAtTime(150, hitTime);
          thudFilter.Q.setValueAtTime(1.5, hitTime);
          
          thudGain.gain.setValueAtTime(0, hitTime);
          thudGain.gain.linearRampToValueAtTime(hitVolume * 0.8, hitTime + 0.003);
          thudGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.18);
          
          thudOsc.connect(thudFilter);
          thudFilter.connect(thudGain);
          thudGain.connect(ctx.destination);
          
          thudOsc.start(hitTime);
          thudOsc.stop(hitTime + 0.2);

          // === WOOD CLACK ===
          // Higher frequency click - the sharp attack of wood on wood
          const clackOsc = ctx.createOscillator();
          const clackGain = ctx.createGain();
          const clackFilter = ctx.createBiquadFilter();
          
          clackOsc.type = 'triangle';
          const clackFreq = 600 + Math.random() * 400;
          clackOsc.frequency.setValueAtTime(clackFreq, hitTime);
          clackOsc.frequency.exponentialRampToValueAtTime(clackFreq * 0.4, hitTime + 0.04);
          
          clackFilter.type = 'bandpass';
          clackFilter.frequency.setValueAtTime(900 + Math.random() * 300, hitTime);
          clackFilter.Q.setValueAtTime(4, hitTime);
          
          clackGain.gain.setValueAtTime(0, hitTime);
          clackGain.gain.linearRampToValueAtTime(hitVolume * 0.5, hitTime + 0.001);
          clackGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.05);
          
          clackOsc.connect(clackFilter);
          clackFilter.connect(clackGain);
          clackGain.connect(ctx.destination);
          
          clackOsc.start(hitTime);
          clackOsc.stop(hitTime + 0.08);

          // === WOODEN RESONANCE ===
          // Mid-frequency resonance - the hollow wooden body sound
          if (bounce < numBounces / 2) {
            const resOsc = ctx.createOscillator();
            const resGain = ctx.createGain();
            const resFilter = ctx.createBiquadFilter();
            
            resOsc.type = 'sine';
            const resFreq = 180 + Math.random() * 80;
            resOsc.frequency.setValueAtTime(resFreq, hitTime);
            
            resFilter.type = 'bandpass';
            resFilter.frequency.setValueAtTime(300, hitTime);
            resFilter.Q.setValueAtTime(6, hitTime);
            
            resGain.gain.setValueAtTime(0, hitTime);
            resGain.gain.linearRampToValueAtTime(hitVolume * 0.25, hitTime + 0.008);
            resGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.25);
            
            resOsc.connect(resFilter);
            resFilter.connect(resGain);
            resGain.connect(ctx.destination);
            
            resOsc.start(hitTime);
            resOsc.stop(hitTime + 0.3);
          }

          // === TABLE RESONANCE ===
          // Very low frequency - table vibration
          if (bounce < 3 && hit === 0) {
            const tableOsc = ctx.createOscillator();
            const tableGain = ctx.createGain();
            const tableFilter = ctx.createBiquadFilter();
            
            tableOsc.type = 'sine';
            tableOsc.frequency.setValueAtTime(40 + Math.random() * 20, hitTime);
            
            tableFilter.type = 'lowpass';
            tableFilter.frequency.setValueAtTime(80, hitTime);
            
            tableGain.gain.setValueAtTime(0, hitTime);
            tableGain.gain.linearRampToValueAtTime(hitVolume * 0.4, hitTime + 0.01);
            tableGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.3);
            
            tableOsc.connect(tableFilter);
            tableFilter.connect(tableGain);
            tableGain.connect(ctx.destination);
            
            tableOsc.start(hitTime);
            tableOsc.stop(hitTime + 0.35);
          }
        }
      }

      // === ROLLING TEXTURE ===
      // Noise for the rolling/tumbling sound
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * totalDuration, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      // Create filtered noise that sounds like dice tumbling
      let lastValue = 0;
      for (let i = 0; i < noiseData.length; i++) {
        // Low-pass filtered noise for smoother rolling sound
        const white = (Math.random() * 2 - 1);
        lastValue = lastValue * 0.95 + white * 0.05;
        noiseData[i] = lastValue * 0.5;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      const noiseFilter2 = ctx.createBiquadFilter();
      
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800 + diceCount * 100, now);
      noiseFilter.Q.setValueAtTime(2, now);
      
      noiseFilter2.type = 'highpass';
      noiseFilter2.frequency.setValueAtTime(200, now);
      
      // Envelope: builds up then fades
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.15, now + 0.1);
      noiseGain.gain.linearRampToValueAtTime(baseVolume * 0.08, now + totalDuration * 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + totalDuration);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseFilter2);
      noiseFilter2.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      noiseSource.start(now);
      noiseSource.stop(now + totalDuration);

      // === FINAL SETTLE ===
      // Last definitive "clunk" when dice stops
      const settleTime = now + totalDuration * 0.85;
      
      for (let d = 0; d < diceCount; d++) {
        const dieSettleTime = settleTime + d * 0.03 + Math.random() * 0.02;
        
        const settleOsc = ctx.createOscillator();
        const settleGain = ctx.createGain();
        const settleFilter = ctx.createBiquadFilter();
        
        settleOsc.type = 'triangle';
        settleOsc.frequency.setValueAtTime(250 + Math.random() * 100, dieSettleTime);
        settleOsc.frequency.exponentialRampToValueAtTime(100, dieSettleTime + 0.08);
        
        settleFilter.type = 'lowpass';
        settleFilter.frequency.setValueAtTime(500, dieSettleTime);
        
        settleGain.gain.setValueAtTime(0, dieSettleTime);
        settleGain.gain.linearRampToValueAtTime(baseVolume * 0.3, dieSettleTime + 0.002);
        settleGain.gain.exponentialRampToValueAtTime(0.001, dieSettleTime + 0.1);
        
        settleOsc.connect(settleFilter);
        settleFilter.connect(settleGain);
        settleGain.connect(ctx.destination);
        
        settleOsc.start(dieSettleTime);
        settleOsc.stop(dieSettleTime + 0.15);
      }

    } catch (error) {
      console.warn('Could not play dice sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
