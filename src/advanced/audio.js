/* =====================================================
Copyright (c) 2012 Satoshi Takano

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
===================================================== */

/**
* @fileOverview Set of prototypes related to the WebAudio.
* @version 0.6.0
*/ 

/** 
* @namespace advanced.audio
*/

new Namespace("advanced.audio").use(function() {
    console.log('imported ', this.nsName)
    this.imported();
    
    var audioNamespace = this;
    
    /**
    * The AudioPort represents AudioNodes's audio i/o.
    * @class AudioPort
    * @param {AudioNode} node The client node.
    * @param {AudioNode} delegateNode The node that observes changing of port's connection.
    **/
    proto(function AudioPort() {
        def(function initialize(node, delegateNode) {
            this._node = node;
            this._delegateNode = delegateNode;
            this._toPorts = [];
            this._fromPorts = [];
            
            this.busNumber = 0;
        })
        
        /**
        * Connects this port to the port that is passed to the argument.
        * @method to
        * @memberOf AudioPort
        * @param {AudioPort} toPort The destination port.
        **/
        def(function to(toPort) {
            
            this._node._nativeNode.connect(toPort._node._nativeNode, this.busNumber, toPort.busNumber);

            this._toPorts.push(toPort);
            toPort._fromPorts.push(this);
            
            this._delegateNode.onOutputTo(toPort);
            toPort._delegateNode.onInputFrom(this);
        })
        
        /**
        * Connects the port that is passed to the argument to this port.
        * @method from
        * @memberOf AudioPort
        * @param {AudioPort} fromPort The source port.
        **/
        def(function from(fromPort) {
            fromPort._node._nativeNode.connect(this._node._nativeNode, fromPort.busNumber, this.busNumber);
            
            this._fromPorts.push(fromPort);
            fromPort._toPorts.push(this);
            
            fromPort._delegateNode.onOutputTo(this);
            this._delegateNode.onInputFrom(fromPort);
        })
        
        /**
        * Disconnects this port from the port that is passed to the argument.
        * @method disconnectTo
        * @memberOf AudioPort
        * @param {AudioPort} toPort The destination port.
        **/
        def(function disconnectTo(toPort) {
            this._node._nativeNode.disconnect(toPort.busNumber);
            cleanPorts(this, toPort);

            this._delegateNode.onDisconnectOutput(toPort);
            toPort._delegateNode.onDisconnectInput(this);
        })
        
        /**
        * Disconnects the port that is passed to the argument from this port.
        * @method disconnectFrom
        * @memberOf AudioPort
        * @param {AudioPort} fromPort The source port.
        **/
        def(function disconnectFrom(fromPort) {
            fromPort._node._nativeNode.disconnect(this.busNumber);
            cleanPorts(fromPort, this);

            this._delegateNode.onDisconnectInput(fromPort);
            fromPort._delegateNode.onDisconnectOutput(this);
        })
        
        /**
        * Returns ports that has connected to this input port.
        * @member {array} inputs
        * @memberOf AudioPort#
        **/
        getter("inputs", function() {
            return this._fromPorts;
        })
        
        /**
        * Returns ports that is connected from this output port.
        * @member {array} outputs
        * @memberOf AudioPort#
        **/
        getter("outputs", function() {
            return this._toPorts;
        })
        
        function cleanPorts(src, dest) {
            var toPorts = src._toPorts;
            var tolen = toPorts.length;
            for (var i = 0; i < tolen; i++) {
                if (toPorts[i] == dest) {
                    toPorts.splice(i, 1);
                    break;
                }
            }
            
            var fromPorts = dest._fromPorts;
            var fromlen = fromPorts.length;
            for (var i = 0; i < fromlen; i++) {
                if (fromPorts[i] == src) {
                    fromPorts.splice(i, 1);
                    break;
                }
            }
        }
    })
    
    
    /**
    * The AudioNode object.
    * @class AudioNode
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function AudioNode() {
        def(function initialize(context) {
            this.context = context;
            this.inputPorts = [];
            this.outputPorts = [];
            this.busNumber = 0;
        })
        
        /** @private **/
        def(function setInputPortNode(node) {
            var num = node._nativeNode.numberOfInputs;
            for (var i = 0; i < num; i++) {
                var port = new audioNamespace.AudioPort(node, this);
                port.busNumber = i;
                this.inputPorts.push(port);
            }
        })
        
        /** @private **/
        def(function setOutputPortNode(node) {
            var num = node._nativeNode.numberOfOutputs;
            for (var i = 0; i < num; i++) {
                var port = new audioNamespace.AudioPort(node, this);
                port.busNumber = i;
                this.outputPorts.push(port);
            }
        })
        
        /**
        * Returns the input port according to the specified bus.
        * @method inputPort
        * @memberOf AudioNode#
        * @param {number} The bus number.
        * @returns {AudioPort} The input port.
        **/
        def(function inputPort(bus) {
            return this.inputPorts[bus];
        })
        
        /**
        * Returns the output port according to the specified bus.
        * @method outputPort
        * @memberOf AudioNode#
        * @param {number} The bus number.
        * @returns {AudioPort} The output port.
        **/
        
        def(function outputPort(bus) {
            return this.outputPorts[bus];
        })
        
        /**
        * The delegate method that will called when change the input connections.
        * @method onInputFrom
        * @memberof AudioNode#
        * @param {AudioNode} source The new source node.
        * @protected
        **/
        def(function onInputFrom(source) {

        })

        /**
        * The delegate method that will called when change the input connections.
        * @method onInputFrom
        * @memberof AudioNode#
        * @param {AudioNode} source The new source node.
        * @protected
        **/
        def(function onDisconnectInput(source) {

        })

        /**
        * The delegate method that will called when change the output connections.
        * @method onOutputTo
        * @memberof AudioNode#
        * @param {AudioNode} destination The new destination node.
        * @protected
        **/
        def(function onOutputTo(destination) {

        })

        /**
        * The delegate method that will called when change the output connections.
        * @method onOutputTo
        * @memberof AudioNode#
        * @param {AudioNode} destination The new destination node.
        * @protected
        **/
        def(function onDisconnectOutput(destination) {

        })
        
        
        /**
        * The number of inputs.
        * @member {number} numberOfInputs
        * @memberOf AudioNode#
        * @readonly
        **/
        getter("numberOfInputs", function() {
            return this.inputPorts.length;
        })
        /**
        * The number of outputs.
        * @member {number} numberOfOutputs
        * @memberOf AudioNode#
        * @readonly
        **/
        getter("numberOfOutputs", function() {
            return this.outputPorts.length;
        })
    })
    
    
    /**
    * The AudioFile object.
    * @class AudioFile
    * @augments AudioNode
    * @param {Audiocontext} context The AudioContext.
    **/
    proto(function AudioFile() {
        ex(audioNamespace.AudioNode)
        
        def(function initialize(context) {
            this.$super(context);
            /** 
            * The audio buffer.
            * @member buffer
            * @memberOf AudioFile
            **/
            this.buffer = null;
        })
        
        /**
        * Loads a audio file.
        * @method load
        * @memberOf AudioFile
        * @param {string} url The path of the audio file.
        * @param {function} loadedCallback The callback function that will called when it finished loading the audio file.
        **/
        def(function load(url, loadedCallback) {
            var _this = this;
            var req = new XMLHttpRequest();
            req.open("GET", url);
            req.responseType = "arraybuffer";
            req.onload = function() {
                _this.context._nativeContext.decodeAudioData(req.response, function(arraybuffer) {
                    _this.buffer = arraybuffer;
                    // for (var k in arraybuffer) console.log(k, arraybuffer[k])
                    if (loadedCallback) loadedCallback.call();
                })
            };
            req.send();
        })
    })
    
    
    /**
    * The AudioContext object.
    * @class AudioContext
    * @augments AudioNode
    **/
    proto(function AudioContext() {
        ex(audioNamespace.AudioNode)
        
        def(function initialize() {
            this._nativeContext = new webkitAudioContext();
            this._nativeNode = this._nativeContext.destination;
            this.$super(this);

            this.setInputPortNode(this)
        })
    })
    
    
    /**
    * The GainNode object.
    * @class GainNode
    * @augments AudioNode
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function GainNode() {
        ex(audioNamespace.AudioNode)
        
        def(function initialize(context) {
            this.$super(context);

            this._nativeNode = context._nativeContext.createGainNode();
            this.setInputPortNode(this);
            this.setOutputPortNode(this);
            this.parameter = this._nativeNode.gain;
        })
        
        /** 
        * The gain value of this node.
        * @member {number} gain
        * @memberOf GainNode#
        **/
        getter("gain", function() {return this._nativeNode.gain;})
        setter("gain", function(gain) {this.parameter.value = gain;})
    })
    
    
    /**
    * The AudioSource object.
    * @class AudioSource
    * @augments AudioNode
    * @param {AudioContext} context The AudioContext node.
    **/
    proto(function AudioSource() {
        ex(audioNamespace.AudioNode)
        
        def(function initialize(context) {
            this.$super(context);
            this.context = context;
            this.gainNode = new audioNamespace.GainNode(context);
            this._buffer = null;
            this.setOutputPortNode(this.gainNode);
        })
        
        /**
        * Starts rendering.
        * @method start
        * @memberOf AudioSource#
        * @param {number} positionInSeconds The starting position in audio buffer.
        **/
        def(function start(positionInSeconds) {
        })
        
        /**
        * Stops rendering.
        * @method stop
        * @memberOf AudioSource#
        **/
        def(function stop() {
        })
        
        /** 
        * The duration of the audio buffer.
        * @member duration
        * @memberOf AudioSource#
        **/
        getter("duration", function() {
            return this._buffer.duration;
        })
        
        /** 
        * The buffer of the audio buffer.
        * @member buffer
        * @memberOf AudioSource#
        **/
        getter("buffer", function() {
            return this._buffer;
        })
        setter("buffer", function(buf) {
            this._buffer = buf;
        })
    })
    
    
    /**
    * The AudioFilePlayer object.
    * @class AudioFilePlayer
    * @augments AudioSource
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function AudioFilePlayer() {
        ex(audioNamespace.AudioSource)
        
        def(function initialize(context) {
            this.$super(context);
        })
        
        def(function start(positionInSeconds) {
            var duration = this.duration - positionInSeconds;
            var node = this._nativeNode = this.context._nativeContext.createBufferSource();
            node.buffer = this.buffer;
            node.connect(this.gainNode._nativeNode);
            node.noteGrainOn(0, positionInSeconds, duration);
        })
        
        def(function stop() {
            this._nativeNode.noteOff(0);
            this._nativeNode.disconnect();
        })
    })
    
    
    /**
    * The AudioSignalProcessingNode object.
    * @class AudioProcessingNode
    * @augments AudioNode
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function AudioSignalProcessingNode() {
        ex(audioNamespace.AudioNode)
        
        def(function initialize(context) {
            this.$super(context);
            this._nativeNode = context._nativeContext.createJavaScriptNode(1024, 2, 2);
            
            // this.setInputPortNode(this);
            //             this.setOutputPortNode(this);
            var _this = this;
            this._nativeNode.onaudioprocess = function(e) {
                _this.process(e);
            };
        })
        
        /**
        * The function that is called when audio context needs rendering the audio.
        * @param {object} e The event object.
        **/
        def(function process(e) {
            
        })
        
    })
    
    /**
    * The Microphone object.
    * @class Microphone
    * @augments AudioSignalProcessingNode
    * @param {context} context The AudioContext object.
    * @param {mediaStream} mediaStream The native MediaStream object.
    **/
    proto(function Microphone() {
        ex(audioNamespace.AudioSignalProcessingNode)
        
        def(function initialize(context, mediaStream) {
            this.$super(context);
            
            this._nativeNode = context._nativeContext.createMediaStreamSource(mediaStream);
            this.setOutputPortNode(this);
        })
    })
    
    /**
    * @private
    * @class AudioRenderer
    **/
    proto(function AudioRenderer() {
        ex(audioNamespace.AudioSignalProcessingNode)
        
        def(function initialize(context, mediaStream) {
            this.$super(context);
            this.setInputPortNode(this);
            this.setOutputPortNode(this);
            
            this.renderFunc = null;
        })
        
        def(function process(e) {
            this.renderFunc(e);
        })
        
    })
    
    
    /**
    * The Panner object manages the pan of the audio.
    * @class Panner
    * @augments AudioNode
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function Panner() {
        ex(audioNamespace.AudioNode)
        
        def(function initialize(context) {
            this.$super(context);
            
            this._x = 0;
            this._y = 0;
            this._z = 0;
            
            var panner = context._nativeContext.createPanner();
            this._nativeNode = panner;
            
            var max = 20;
            var min = -20;
            panner.setPosition(0, 0, 0);

            this.setInputPortNode(this);
            this.setOutputPortNode(this);
        })
        
        getter("x", function() { return this._x; })
        setter("x", function(v) { this._x = v; this._nativeNode.setPosition(v, this._y, this._z); })
        
        getter("y", function() { return this._y; })
        setter("y", function(v) { this._y = v; this._nativeNode.setPosition(this._x, v, this._z); })
        
        getter("z", function() { return this._z; })
        setter("z", function(v) { this._z = v; this._nativeNode.setPosition(this._x, this._y, v); })
    })
    
    
    /**
    * The WhiteNodise object generates the white noise.
    * @class WhiteNoise
    * @augments AudioSignalProcessingNode
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function WhiteNoise() {
        ex(audioNamespace.AudioSignalProcessingNode)
        
        def(function initialize(context) {
            this.$super(context);
            
            this.panner = new audioNamespace.Panner(context);
            
            this._nativeNode.connect(this.panner._nativeNode);
            this.setOutputPortNode(this.panner);
        })
        
        def(function process(e) {
            var outBufferL = e.outputBuffer.getChannelData(0);
            // var outBufferR = e.outputBuffer.getChannelData(1);
             for (var i = 0, l = outBufferL.length; i < l; i++) {
             outBufferL[i] = Math.random() * 2 - 1;
          }
        })
        
    })
    
    
    /**
    * The AudioBufferProcessor object provides some extended playing audio feature.
    * @class AudioBufferProcessor
    * @augments AudioSource
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function AudioBufferProcessor() {
        ex(audioNamespace.AudioSource)
        
        def(function initialize(context) {
            this.$super(context);
            this._nativeNode = context._nativeContext.createJavaScriptNode(1024, 2, 2);
            this._nativeNode.onaudioprocess = process;
            if (window.__webaudioDSPNodes__ == undefined) window.__webaudioDSPNodes__ = [];
            
            var raw = this._nativeNode;
            raw._this = this;
            
            this._samples = [];
            
            this._duration = 0;
            this._totalFrames = 0;
            this._currentFrame = 0;
            this._isPlaying = false;
            
            this._loopInFrame = 0;
            this._loopOutFrame = 0;
            
            this.loopEnabled = false;
        })

        function process(e) {
            this._this.process(e);
        }
        
        def(function start(positionInSeconds) {
            this._isPlaying = true;
            this._nativeNode.connect(this.gainNode._nativeNode);
            window.__webaudioDSPNodes__.push(this._nativeNode);
            this._currentFrame = Math.floor(this._totalFrames * (positionInSeconds / this._duration));
        })
        
        def(function stop() {
            this._isPlaying = false;
            var nodes = window.__webaudioDSPNodes__;
            var l = nodes.length;
            for (var i = 0; i < l; i++) if (nodes[i] == this._nativeNode) nodes.splice(i, 1);
        })
        
        def(function process(processingEvent) {
            if (!this._isPlaying) {
                this._nativeNode.disconnect();
                return;
            }

            var outSamples = processingEvent.outputBuffer.getChannelData(0);
            var length = outSamples.length;
            var c = this._currentFrame;
            if (this.loopEnabled) {
                var i = this._loopInFrame;
                var o = this._loopOutFrame;
                if (o < c) c = i + (c - o);
                else if (c < i) c = o - (i - c);
            }
            outSamples.set(this._samples[0].subarray(c, c + length));

            var numChannels = this._samples.length;
            for (var channel = 1; channel < numChannels; channel++) {
                outSamples = processingEvent.outputBuffer.getChannelData(channel);
                 outSamples.set(this._samples[channel].subarray(c, c + length));
            }
            
             c += length;
        
            var total = this._totalFrames;
            if (total < c) {
                this.stop();
            }
            this._currentFrame = c;
        })

        def(function setBufferWithRange(buf, startSample, endSample) {
            this.buffer = null;            
            this._samples = [];
            var numChannels = buf.numberOfChannels;
            for (var i = 0; i < numChannels; i++) {
                var samps = buf.getChannelData(i);
                samps = samps.subarray(startSample, endSample)
                this._samples.push(samps);
            }
            this._totalFrames = this._samples[0].length;
            this._currentFrame = 0;
            this._duration = this._totalFrames / buf.sampleRate;
        })
        
        /**
        * The audio buffer of this object.
        * @member buffer
        * @memberOf AudioBufferProcessor
        **/
        setter("buffer", function(buf) {
            this.$super(buf);
            if (buf == null) {
                this._samples = null;
                this._totalFrames = this._currentFrame = this._duration = 0;
                return;
            }

            this._samples = [];
            var numChannels = buf.numberOfChannels;
            for (var i = 0; i < numChannels; i++) {
                var samps = buf.getChannelData(i);
                this._samples.push(samps);
            }
            this._totalFrames = buf.length;
            this._currentFrame = 0;
            this._duration = buf.duration;
        })
        
        /**
        * The duration of the audio buffer.
        * @member {number} duration
        * @memberOf AudioBufferProcessor
        * @readonly
        **/
        getter("duration", function() {
            return this._duration;
        })
        
        /**
        * The audio samples in the buffer.
        * @member {object} samples
        * @memberOf AudioBufferProcessor
        * @readonly
        **/
        getter("samples", function() {
            return this._samples;
        })
        
        /**
        * The loop in time.
        * @member {number} loopInTime
        * @memberOf AudioBufferProcessor
        **/
        getter("loopInTime", function() {
            return this._duration * (this._loopInFrame / this._totalFrames);
        })
        setter("loopInTime", function(time) {
            this._loopInFrame = Math.floor(this._totalFrames * (time / this._duration));
        })
        
        /**
        * The loop out time.
        * @member {number} loopInTime
        * @memberOf AudioBufferProcessor
        **/
        getter("loopOutTime", function() {
            return this._duration * (this._loopOutFrame / this._totalFrames);
        })
        setter("loopOutTime", function(time) {
            this._loopOutFrame = Math.floor(this._totalFrames * (time / this._duration));
        })
        
        /**
        * The time that points the playback position in the buffer.
        * @member {number} currentTime
        * @memberOf AudioBufferProcessor
        * @readonly
        **/
        getter("currentTime", function() {
            return this._duration * (this._currentFrame / this._totalFrames);
        })
    })
    
    /**
    * The AudioEffect object.
    * @class AudioEffect
    * @augments AudioNode
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function AudioEffect() {
        ex(audioNamespace.AudioNode)
        attrReader("bypass")
        
        def(function initialize(context, rawNode) {
            this.$super(context);
            this._nativeNode = rawNode;
            this._wet = 1;
            
            this.gainNode = new audioNamespace.GainNode(context);
            this.throughNode = new audioNamespace.GainNode(context);
            
            this.setInputPortNode(this);
            rawNode.connect(this.gainNode._nativeNode);
            this.setOutputPortNode(this.gainNode);

            this._bypass = false;
        })

        setter("bypass", function(b) {
            this._bypass = b;
            if (b) {
                this.gainNode.gain = 0;
            } else {
                this.gainNode.gain = this._wet;
            }
        })


        // hooks the connection changing
        def(function onInputFrom(from) {
            from.to(this.throughNode.inputPort(0));
        })
        
        def(function onOutputTo(destination) {
            destination.from(this.throughNode.outputPort(0));
        })

        def(function onDisconnectInput(source) {
            source.disconnectTo(this.throughNode.inputPort(0));
        })

        def(function onDisconnectOutput(destination) {
            destination.disconnectFrom(this.throughNode.outputPort(0));
        })
        
        /**
        * The wet value.
        * @member {number} wet
        * @memberOf AudioEffect
        **/
        getter("wet", function() {
            return this._wet;
        })
        setter("wet", function(value) {
            this._wet = value;
            if (!this._bypass)
                this.gainNode.gain = value;
        })
    })
    
    
    /**
    * The AudioDelay object.
    * @class AudioDelay
    * @augments AudioNode
    * @param {AudioContext} context The AudioContext object.
    * @param {nubmer} delayTime The delay time.
    **/
    proto(function AudioDelay() {
        ex(audioNamespace.AudioEffect)
        
        def(function initialize(context, delayTime) {
            var node = this._nativeNode = context._nativeContext.createDelay();
            this.$super(context, node);

            node.delayTime.value = delayTime;
        })
    })
    
    /**
    * The AudioFilter object.
    * @class AudioFilter
    * @augments AudioEffect
    * @param {AudioContext} context The AudioContext object.
    * @param {number} filterType The filter type that defined AudioFilter's static members.
    **/
    proto(function AudioFilter() {
        ex(audioNamespace.AudioEffect)
        
        /**
        * Low pass filter type.
        * @const {number} LOW_PASS
        * @memberOf AudioFilter
        **/
        $$.LOW_PASS = 0;
        /**
        * High pass filter type.
        * @const {number} HIGH_PASS
        * @memberOf AudioFilter
        **/
        $$.HIGH_PASS = 1;
        /**
        * Low shelf filter type.
        * @const {number} LOW_SHELF
        * @memberOf AudioFilter
        **/
        $$.LOW_SHELF = 3;
        /**
        * High shelf filter type.
        * @const {number} HIGH_SHELF
        * @memberOf AudioFilter
        **/
        $$.HIGH_SHELF = 4;
        
        def(function initialize(context, filterType) {
            this._nativeNode = context._nativeContext.createBiquadFilter();
            this._nativeNode.type = filterType;
            this.$super(context, this._nativeNode);
        })
        
        /**
        * The filter frequency.
        * @member {number} frequency
        * @memberOf AudioFilter#
        **/
        getter("frequency", function() {
            return this._nativeNode.frequency;
        })
        setter("frequency", function(f) {
            this._nativeNode.frequency = f;
        })
        
        /**
        * The filter detune.
        * @member {number} detune
        * @memberOf AudioFilter#
        **/
        getter("detune", function() {
            return this._nativeNode.detune;
        })
        setter("detune", function(d) {
            this._nativeNode.detune = d;
        })
        
        /**
        * The filter Q.
        * @member {number} Q
        * @memberOf AudioFilter
        **/
        getter("Q", function() {
            return this._nativeNode.Q;
        })
        setter("Q", function(q) {
            this._nativeNode.Q = q;
        })
        
        /**
        * The filter gain.
        * @member {number} gain
        * @memberOf AudioFilter
        **/
        getter("gain", function() {
            return this._nativeNode.gain;
        })
        setter("gain", function(g) {
            this._nativeNode.gain = gain;
        })
    })
    
    
    /**
    * The AudioReverb object.
    * @class AudioReverb
    * @augments AudioEffect
    * @param {AudioContext} context The AudioContext object.
    **/
    proto(function AudioReverb() {
        ex(audioNamespace.AudioEffect)
        
        def(function initialize(context) {
            var node = context._nativeContext.createConvolver();
            this.$super(context, node);
        })
        
        /**
        * The impulse response buffer.
        * @member {object} buffer
        * @memberOf AudioReverb
        **/
        getter("buffer", function() {
            return this._nativeNode.buffer;
        })
        setter("buffer", function(buf) {
            this._nativeNode.buffer = buf;
        })
        
    })
})
