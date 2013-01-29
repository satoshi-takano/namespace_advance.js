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
* @fileOverview 
*/ 

new Namespace(NS_AUDIO).use(function() {
	console.log('build audio')
	
	var audioNamespace = this;
	
	/**
	* @class AudioPort
	**/
	proto(function AudioPort() {
		init(function(node, delegateNode) {
			this._node = node;
			this._delegateNode = delegateNode;
			this._toPorts = [];
			this._fromPorts = [];
			
			this.busNumber = 0;
		})
		
		def(function to(toPort) {
			this._node._nativeNode.connect(toPort._node._nativeNode, this.busNumber, toPort.busNumber);

			this._toPorts.push(toPort);
			toPort._fromPorts.push(this);
			
			this._delegateNode.onOutputTo(toPort);
			toPort._delegateNode.onInputFrom(this);
		})
		
		def(function from(fromPort) {
			fromPort._node._nativeNode.connect(this._node._nativeNode, fromPort.busNumber, this.busNumber);
			
			this._fromPorts.push(fromPort);
			fromPort._toPorts.push(this);
			
			fromPort._delegateNode.onOutputTo(this);
			this._delegateNode.onInputFrom(fromPort);
		})
		
		def(function disconnectTo(toPort) {
			this._node._nativeNode.disconnect(toPort.busNumber);
			cleanPorts(this, toPort);
		})
		
		def(function disconnectFrom(fromPort) {
			fromPort.disconnect(this.busNumber);
			cleanPorts(fromPort, this);
		})
		
		getter("inputs", function() {
			return this._fromPorts;
		})
		
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
	* @class AudioNode
	**/
	proto(function AudioNode() {
		init(function(context) {
			this.context = context;
			this.inputPorts = [];
			this.outputPorts = [];
			this.busNumber = 0;
		})
		
		def(function setInputPortNode(node) {
			var num = node._nativeNode.numberOfInputs;
			for (var i = 0; i < num; i++) {
				var port = new audio.AudioPort(node, this);
				port.busNumber = i;
				this.inputPorts.push(port);
			}
		})
		
		def(function setOutputPortNode(node) {
			var num = node._nativeNode.numberOfOutputs;
			for (var i = 0; i < num; i++) {
				var port = new audio.AudioPort(node, this);
				port.busNumber = i;
				this.outputPorts.push(port);
			}
		})
		
		def(function inputPort(bus) {
			return this.inputPorts[bus];
		})
		
		def(function outputPort(bus) {
			return this.outputPorts[bus];
		})
		
		def(function onInputFrom(source) {

		})
		
		def(function onOutputTo(destination) {

		})
		
		getter("numberOfInputs", function() {
			return this.inputPorts.length;
		})
		getter("numberOfOutputs", function() {
			return this.outputPorts.length;
		})
	})
	
	
	/**
	* @class AudioFile
	**/
	proto(function AudioFile() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
			this.$super(context);
			this.buffer = null;
		})
		
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
	* @class AudioContext
	**/
	proto(function AudioContext() {
		ex(audioNamespace.AudioNode)
		
		init(function() {
			this._nativeContext = new webkitAudioContext();
			this._nativeNode = this._nativeContext.destination;
			this.$super(this);

			this.setInputPortNode(this)
		})
	})
	
	
	/**
	* @class GainNode
	**/
	proto(function GainNode() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
			this.$super(context);

			this._nativeNode = context._nativeContext.createGainNode();
			this.setInputPortNode(this);
			this.setOutputPortNode(this);
			this.parameter = this._nativeNode.gain;
		})
		
		getter("gain", function() {return this._nativeNode.gain;})
		setter("gain", function(gain) {this.parameter.value = gain;})
	})
	
	
	/**
	* @class AudioSource
	**/
	proto(function AudioSource() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
			this.$super(context);
			this.context = context;
			this.gainNode = new audioNamespace.GainNode(context);
			this._buffer = null;
			this.setOutputPortNode(this.gainNode);
		})
		
		def(function start(positionInSeconds) {
		})
		
		def(function stop() {
		})
		
		getter("duration", function() {
			return this._buffer.duration;
		})
		
		getter("buffer", function() {
			return this._buffer;
		})
		setter("buffer", function(buf) {
			this._buffer = buf;
		})
	})
	
	
	/**
	* @class AudioFilePlayer
	**/
	proto(function AudioFilePlayer() {
		ex(audioNamespace.AudioSource)
		
		init(function(context) {
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
	* @class AudioProcessingNode
	**/
	proto(function AudioSignalProcessingNode() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
			this.$super(context);
			this._nativeNode = context._nativeContext.createJavaScriptNode(1024, 1, 1);
			
			// this.setInputPortNode(this);
			// 			this.setOutputPortNode(this);
			var _this = this;
			this._nativeNode.onaudioprocess = function(e) {
				_this.process(e);
			};
		})
		
		def(function process(e) {
			
		})
		
	})
	
	/**
	* @class Panner
	**/
	proto(function Panner() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
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
	* @class Noise
	**/
	proto(function WhiteNoise() {
		ex(audioNamespace.AudioSignalProcessingNode)
		
		init(function(context, frequency) {
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
	* @class AudioBufferSource
	**/
	proto(function AudioBufferProcessor() {
		ex(audioNamespace.AudioSource)
		
		init(function(context) {
			this.$super(context);
			this._nativeNode = context._nativeContext.createJavaScriptNode(1024, 1, 1);
			this._nativeNode.onaudioprocess = process;
			if (window.__webaudioDSPNodes__ == undefined) window.__webaudioDSPNodes__ = [];
			
			var raw = this._nativeNode;
			raw._this = this;
			
			// Float32Array
			this._samples = null;
			
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

		 	outSamples.set(this._samples.subarray(c, c + length));
		 	c += length;
		
			var total = this._totalFrames;
			if (total < c) {
				this.stop();
			}
			this._currentFrame = c;
		})
		
		setter("buffer", function(buf) {
			this.$super(buf);
			this._samples = buf.getChannelData(0);
			this._totalFrames = buf.length;
			this._currentFrame = 0;
			this._duration = buf.duration;
		})
		
		getter("duration", function() {
			return this._duration;
		})
		getter("samples", function() {
			return this._samples;
		})
		
		getter("loopInTime", function() {
			return this._duration * (this._loopInFrame / this._totalFrames);
		})
		setter("loopInTime", function(time) {
			this._loopInFrame = Math.floor(this._totalFrames * (time / this._duration));
		})
		
		getter("loopOutTime", function() {
			return this._duration * (this._loopOutFrame / this._totalFrames);
		})
		setter("loopOutTime", function(time) {
			this._loopOutFrame = Math.floor(this._totalFrames * (time / this._duration));
		})
		
		getter("currentTime", function() {
			return this._duration * (this._currentFrame / this._totalFrames);
		})
	})
	
	/**
	* @class AudioEffect
	**/
	proto(function AudioEffect() {
		ex(audioNamespace.AudioNode)
		
		init(function(context, rawNode) {
			this.$super(context);
			this._nativeNode = rawNode;
			this._wet = 1;
			
			this.gainNode = new audioNamespace.GainNode(context);
			this.setInputPortNode(this);
			rawNode.connect(this.gainNode._nativeNode);
			this.setOutputPortNode(this.gainNode);
		})
		
		def(function onInputFrom(from) {
			
		})
		
		// to do : disconnection handling
		def(function onOutputTo(destination) {
			var numInputs = this.numberOfInputs;
			for (var i = 0; i < numInputs; i++) {
				var inPort = this.inputPort(i);
				var myInPortsInputs = inPort.inputs;
				var numMyInPortsInputs = myInPortsInputs.length;
				for (var j = 0; j < numMyInPortsInputs; j++) {
					destination.from(myInPortsInputs[j]);
				}
			}
		})
		
		getter("wet", function() {
			return this._wet;
		})
		setter("wet", function(value) {
			this._wet = value;
			this.gainNode.gain = value;
		})
	})
	
	
	/**
	* @class AudioDelayNode
	**/
	proto(function AudioDelay() {
		ex(audio.AudioNode)
		
		init(function(context, delayTime) {
			this.$super(context);
			
			var node = this._nativeNode = context._nativeContext.createDelay();
			node.delayTime.value = 0.5;
			
			this.setInputPortNode(this);
			this.setOutputPortNode(this);
		})
	})
	
	/**
	* @class AudioFilter
	**/
	proto(function AudioFilter() {
		ex(audio.AudioEffect)
		
		$$.LOW_PASS = 0;
		$$.HIGH_PASS = 1;
		$$.LOW_SHELF = 3;
		$$.HIGH_SHELF = 4;
		
		init(function(context, filterType) {
			this._nativeNode = context._nativeContext.createBiquadFilter();
			this._nativeNode.type = filterType;
			this.$super(context, this._nativeNode);
		})
		
		getter("frequency", function() {
			return this._nativeNode.frequency;
		})
		setter("frequency", function(f) {
			this._nativeNode.frequency = f;
		})
		getter("detune", function() {
			return this._nativeNode.detune;
		})
		setter("detune", function(d) {
			this._nativeNode.detune = d;
		})
		getter("Q", function() {
			return this._nativeNode.Q;
		})
		setter("Q", function(q) {
			this._nativeNode.Q = q;
		})
		getter("gain", function() {
			return this._nativeNode.gain;
		})
		setter("gain", function(g) {
			this._nativeNode.gain = gain;
		})
	})
	
	
	/**
	* @class AudioDelayNode
	**/
	proto(function AudioReverb() {
		ex(audio.AudioEffect)
		
		init(function(context) {
			var node = context._nativeContext.createConvolver();
			this.$super(context, node);
		})
		
		getter("buffer", function() {
			return this._nativeNode.buffer;
		})
		setter("buffer", function(buf) {
			this._nativeNode.buffer = buf;
		})
		
	})
})