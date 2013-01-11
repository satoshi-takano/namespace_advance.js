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

new Namespace(namespace_lib_audio).use(function() {
	var audioNamespace = this;
	
	/**
	* @class AudioPort
	**/
	proto(function AudioPort() {
		init(function(rawNode) {
			this.rawNode = rawNode;
			this.toPorts = [];
			this.fromPorts = [];
			
			this._tag = 0;
		})
		
		def(function to(toPort) {
			toPort._tag = this.toPorts.length;
			this.rawNode.connect(toPort.rawNode);
			this.toPorts.push(toPort);
		})
		def(function from(fromPort) {
			fromPort._tag = this.fromPorts.length;
			fromPort.rawNode.connect(this.rawNode);
			this.fromPorts.push(fromPort);
		})
		
		def(function disconnectTo(toPort) {
			this.rawNode.disconnect(toPort._tag)
		})
		def(function disconnectFrom(fromPort) {
			fromPort.disconnect(this._tag)
		})
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
		
		def(function addInputPort(port) {
			this.inputPorts.push(port);
		})
		
		def(function addOutputPort(port) {
			this.outputPorts.push(port);
		})
		
		def(function removeInputPort(port) {
			var ports = this.inputPorts;
			var l = ports.length;
			for (var i = 0; i < l; i++) {
				var p = ports[i];
				if (p == port) this.inputPorts.splice(i, 1);
			}
		})
		
		def(function removeOutputPort(port) {
			var ports = this.outputPorts;
			var l = ports.length;
			for (var i = 0; i < l; i++) {
				var p = ports[i];
				if (p == port) this.outputPorts.splice(i, 1);
			}
		})
		
		def(function inputPort(bus) {
			return this.inputPorts[bus];
		})
		
		def(function outputPort(bus) {
			return this.outputPorts[bus];
		})
		
		getter("numberOfInput", function() {
			return this.inputPorts.length;
		})
		getter("numberOfOutput", function() {
			return this.outputPorts.lenght;
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
				_this.context.rawContext.decodeAudioData(req.response, function(arraybuffer) {
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
			this.rawContext = new webkitAudioContext();
			this.$super(this);

			this.addInputPort(audioNamespace.AudioPort.gen(this.rawContext.destination));
		})
	})
	
	
	/**
	* @class GainNode
	**/
	proto(function GainNode() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
			this.$super(context);
			this.rawNode = context.rawContext.createGainNode();
			this.addInputPort(audioNamespace.AudioPort.gen(this.rawNode));
			this.parameter = this.rawNode.gain;
		})
		
		getter("gain", function() {return this.rawNode.gain;})
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
			this.gainNode = audioNamespace.GainNode.gen(context);
			this._buffer = null;
			// set gain
			this.addOutputPort(audioNamespace.AudioPort.gen(this.gainNode.rawNode));
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
			var node = this.rawNode = this.context.rawContext.createBufferSource();
			node.buffer = this.buffer;
			node.connect(this.gainNode.rawNode);
			node.noteGrainOn(0, positionInSeconds, duration);
		})
		
		def(function stop() {
			this.rawNode.noteOff(0);
			this.rawNode.disconnect();
		})
	})
	
	
	/**
	* @class AudioProcessingNode
	**/
	proto(function AudioSignalProcessingNode() {
		ex(audioNamespace.AudioNode)
		
		init(function(context) {
			this.$super(context);
			this.raw = context.rawContext.createJavaScriptNode(1024, 1, 1);
			
			this.addInputPort(audioNamespace.AudioPort.gen(this.raw));
			this.addOutputPort(audioNamespace.AudioPort.gen(this.raw));
			this.raw.onaudioprocess = process;
		})
		
		function process(processingEvent) {
		}
	})
	
	
	/**
	* @class AudioBufferSource
	**/
	proto(function AudioBufferProcessor() {
		ex(audioNamespace.AudioSource)
		
		init(function(context) {
			this.$super(context);
			this.raw = context.rawContext.createScriptProcessor(1024, 1, 1);
			this.raw.onaudioprocess = process;
			if (window.__webaudioDSPNodes__ == undefined) window.__webaudioDSPNodes__ = [];
			
			var raw = this.raw;
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
			this.raw.connect(this.gainNode.rawNode);
			window.__webaudioDSPNodes__.push(this.raw);
			
			this._currentFrame = Math.floor(this._totalFrames * (positionInSeconds / this._duration));
		})
		
		def(function stop() {
			this._isPlaying = false;
			var nodes = window.__webaudioDSPNodes__;
			var l = nodes.length;
			for (var i = 0; i < l; i++) if (nodes[i] == this.raw) nodes.splice(i, 1);
		})
		
		def(function process(processingEvent) {
			if (!this._isPlaying) {
				this.raw.disconnect();
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
			// console.log(c / this._totalFrames, i, o)
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
		
	})
	
})