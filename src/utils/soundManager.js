// Simple synth for game sounds to avoid external dependencies
class SoundManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    playClick() {
        this._playTone(800, 'square', 0.05);
    }

    playMove() {
        this._playTone(600, 'sine', 0.1);
    }

    playDiceShake() {
        // Simulate rattling noise with noise buffer
        const duration = 0.3;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
    }

    playDiceLand() {
        this._playTone(200, 'triangle', 0.1);
        setTimeout(() => this._playTone(250, 'triangle', 0.1), 50);
    }

    playWin() {
        // Victory fanfare
        const now = this.ctx.currentTime;
        [440, 554, 659, 880].forEach((freq, i) => {
            this._playTone(freq, 'square', 0.2, now + i * 0.1);
        });
    }

    _playTone(freq, type, duration, startTime = null) {
        if (this.muted) return;
        if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => { });

        // Safety check for closed context
        if (this.ctx.state === 'closed') return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const start = startTime || this.ctx.currentTime;

        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
    }
}

export const soundManager = new SoundManager();
