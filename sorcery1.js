$( function() {
	var CONST_LIFE_INIT = 4;
	var CONST_FADE_IN = 800;

	//var MyActionName;

	var buttons = $(".section button");
	var status = $("#status");
	var inGame = false;
	
	//**Event**\\
	buttons.click( function() {
		$(this).parents('div').hide();
		goToSectionJSON($(this).attr('go'));
		//gotoSection($(this).attr('go'));
	} );

	//**Functions**\\
	function initGame(){
		setLife( CONST_LIFE_INIT );
	}

	function goToSectionJSON(myId){
		
		$.getJSON("myData.json",function(data){
			
			var items = [];
			var nbEach = 0;
			var myNbById = -1;
			var myActionName = 'null';

			$.each(data.pages, function(key, val){

				if(myId == data.pages[nbEach].myId){myNbById = nbEach;}
				items[nbEach] = "<div class='section' id='" + data.pages[nbEach].myId + "'>" ;
				
				if(data.pages[nbEach].myContentH2 != "null"){
					items[nbEach] += "<h2>" + data.pages[nbEach].myContentH2 + "</h2>";}
				items[nbEach] += data.pages[nbEach].myContentTxt;
				
				if(data.pages[nbEach].myAction != "null"){
					items[nbEach] += "<action name='" + data.pages[nbEach].myAction + "'/>";
					if(myNbById==nbEach){myActionName=data.pages[nbEach].myAction;
						console.log('in'+myActionName);} }
				
				items[nbEach] += "<button go='" + data.pages[nbEach].myGo + "'>" + data.pages[nbEach].myGoContent + "</button>";
				items[nbEach] += "</div>";
					
				nbEach++;
			});
			console.log('in2'+myActionName);
			
			if(myNbById!=-1){$('body').append(items[myNbById]);}

			if(myActionName!='null'){executeAction(myActionName);}

			if(getLife()<=0 && inGame){endGame();}
		});

	}	
/*
	function gotoSection(nameAction) {
		//console.log(MyActionName);
		//var actionName = MyActionName;

		//execution de l'action courante si elle existe
		//var actionName = $('#'+key).children('action').attr('name');
		console.log('actionName :' + actionName);
		if(actionName != 'null')
			executeAction(actionName); 

		//$('#'+key).fadeIn( CONST_FADE_IN );
	}*/
	
	function getLife() {
		return $('.life span.value').html();
	}
	
	function setLife(v) {
		$('.life span.value').html(v);
	}
	
	function loseOneLife() {
		setLife(getLife()-1);
	}
	
	function executeAction(name) { 
		switch(name)
		{
			case 'menu' :
				initMenu();
				break;
			case 'reset' :
				initGame();
				break;
			case 'start' :
				startGame();
				break;
			case 'hit' :
				if(inGame)
					loseOneLife();
				break;
		}
	}

	function startGame() {
		inGame = true;
	}
	
	function endGame() {
		inGame = false;
		goToSectionJSON('death');
	}

	goToSectionJSON('intro');
	//gotoSection('intro');
} );