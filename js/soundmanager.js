var SoundManager={
	soundBank:[],
	init:function(){
		this.soundBank=document.querySelectorAll('audio');
	},

	playSound:function(index){
		this.soundBank[index].play();
	},

	stopSound:function(index){
		this.soundBank[index].stop();
	},

	changeVolume:function(index,level){
		this.soundBank[index].volume=level;
	},
	handle:function(event){
		index=event.target.parentNode.id[4]
	}

}