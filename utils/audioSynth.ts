// Sound synthesis via Web Audio API for interactive feedback
// Completely self-contained and fails elegantly in environments with constraints

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    // Lazy initialize to support click-to-play policies
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    
    return audioCtx;
};

export const playHypeSynthSound = (comboLevel: number) => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        
        // Base frequency rises as combo level goes up!
        const baseFreq = 180 + (comboLevel * 40);
        
        // Frequency sweep (riser effect)
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.35);

        // Sound volume decay
        gainNode.gain.setValueAtTime(0.18, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.38);

        // Different style sound as combo heats up!
        if (comboLevel >= 8) {
            osc.type = 'triangle'; // Buzzier synthesizer feel
        } else {
            osc.type = 'sine'; // Pure round wave sound
        }

        osc.start(now);
        osc.stop(now + 0.4);
    } catch (e) {
        // Fail-safe silently if audio context is blocked
    }
};

export const playOverloadSynthSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        // Play a massive synth riser followed by a sub-woofer style bass drop!
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        osc.type = 'sawtooth';

        // Rising siren frequency
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(45, now + 1.2); // deep heavy drop

        gainNode.gain.setValueAtTime(0.22, now);
        gainNode.gain.linearRampToValueAtTime(0.22, now + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.start(now);
        osc.stop(now + 1.4);
    } catch (e) {
        // Fail-safe
    }
};
