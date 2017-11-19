var Reverb = function(context, parameters) {
	this.context = context;
	this.input = context.createGain();

	var irbuffer;
	this.context = context;
	var ir = new XMLHttpRequest();
	ir.open('GET', "ir.wav", true);
	ir.responseType = 'arraybuffer';
	ir.onload = function() {
			context.decodeAudioData(ir.response, function(buffer) {
					irbuffer = buffer;
			});
	}
	ir.send();

	this.wetGain = context.createGain();
	this.dryGain = context.createGain();
	this.convolver = context.createConvolver();
  this.convolver.buffer = ir.buffer;

	this.convolver.connect(this.wetGain);

	this.wetGain.connect(context.destination);
	this.dryGain.connect(context.destination);

	this.wetGain.gain.value = parameters.reverbWetDry;
	this.dryGain.gain.value = (1-parameters.reverbWetDry);

	this.parameters = parameters;
}


Reverb.prototype.updateParams = function (params, value) {
	switch (params) {
		case 'reverb_dry_wet':
			this.parameters.reverbWetDry = value;
			this.wetGain.gain.value = value;
			this.dryGain.gain.value = 1 - value;
			break;
	}
}
