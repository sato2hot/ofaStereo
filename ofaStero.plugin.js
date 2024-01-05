/**
 * @name ofaStereo
 * @description drown niggas w this stereo xd
 * @version 1.0.0
 * @author Sato and Racing
 * @source https://github.com/sato2hot/ofaStereo
 */

(() => {
    const PluginName = "Stereo";

    class StereoPlugin {
        constructor() {
            this.initialized = false;
            this.audioContext = null;
            this.leftGain = null;
            this.rightGain = null;
            this.gainSlider = null;
            this.config = {
                gainLevel: 1.0, // Default gain level
                delayTimeLeft: 0.3, // Default delay time for left channel
                delayTimeRight: 0.4 // Default delay time for right channel
            };
        }

        getName() {
            return PluginName;
        }

        getDescription() {
            return "A BetterDiscord plugin that adds a stereo echo effect with adjustable volume.";
        }

        getVersion() {
            return "1.0.0";
        }

        start() {
            if (!this.initialized) {
                if ('AudioContext' in window || 'webkitAudioContext' in window) {
                    try {
                        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        this.leftGain = this.audioContext.createGain();
                        this.rightGain = this.audioContext.createGain();
                        
                        const leftDelay = this.audioContext.createDelay();
                        const rightDelay = this.audioContext.createDelay();

                        leftDelay.delayTime.value = this.config.delayTimeLeft;
                        rightDelay.delayTime.value = this.config.delayTimeRight;

                        const leftPanner = this.audioContext.createStereoPanner();
                        const rightPanner = this.audioContext.createStereoPanner();

                        leftDelay.connect(this.leftGain);
                        rightDelay.connect(this.rightGain);
                        this.leftGain.connect(leftPanner);
                        this.rightGain.connect(rightPanner);

                        this.leftGain.gain.value = this.config.gainLevel;
                        this.rightGain.gain.value = this.config.gainLevel;

                        leftPanner.pan.value = -1;
                        rightPanner.pan.value = 1;

                        leftPanner.connect(this.audioContext.destination);
                        rightPanner.connect(this.audioContext.destination);

                        this.gainSlider = document.createElement('input');
                        this.gainSlider.type = 'range';
                        this.gainSlider.min = '0';
                        this.gainSlider.max = '2'; // Adjust this value to set the maximum gain level
                        this.gainSlider.step = '0.1'; // Adjust this value to set the step increment
                        this.gainSlider.value = this.config.gainLevel;
                        this.gainSlider.addEventListener('input', () => {
                            const newGainValue = parseFloat(this.gainSlider.value);
                            this.leftGain.gain.value = newGainValue;
                            this.rightGain.gain.value = newGainValue;
                            this.saveSettings(); // Save settings when slider value changes
                        });

                        document.querySelector('.app').appendChild(this.gainSlider);

                        console.log("StereoPlugin started with adjustable volume.");
                        this.initialized = true;
                    } catch (error) {
                        console.error('Error initializing Web Audio API:', error);
                    }
                } else {
                    console.error('Web Audio API is not supported in this browser.');
                }
            }
        }

        stop() {
            if (this.initialized) {
                this.audioContext.close();
                this.gainSlider.remove();

                console.log("StereoPlugin stopped.");
                this.initialized = false;
            }
        }

        saveSettings() {
            bdPluginStorage.set(PluginName, 'config', this.config);
        }

        loadSettings() {
            const storedConfig = bdPluginStorage.get(PluginName, 'config');
            if (storedConfig) {
                this.config = Object.assign(this.config, storedConfig);
            }
        }
    }

    return new StereoPlugin();
})();
