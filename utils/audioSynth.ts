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

export const playCardSound = (rarity: string) => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Holographic sparkle riser sound
        let baseFreq = 220;
        let duration = 0.4;
        
        if (rarity === 'legendary') {
            baseFreq = 330;
            duration = 0.8;
            osc1.type = 'triangle';
            osc2.type = 'sine';
        } else if (rarity === 'epic') {
            baseFreq = 290;
            duration = 0.6;
            osc1.type = 'triangle';
            osc2.type = 'sine';
        } else {
            baseFreq = 220;
            duration = 0.35;
            osc1.type = 'sine';
            osc2.type = 'sine';
        }

        osc1.frequency.setValueAtTime(baseFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + duration);

        osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 3.75, now + duration);

        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    } catch (e) {
        // Fail-safe silently
    }
};

export const playFlipCardSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;
        osc.type = 'sine';
        
        // Quick high-to-low whoosh sound
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    } catch (e) {
        // Fail-safe
    }
};
