$( function() {
	var CONST_LIFE_INIT = 4;
	var CONST_FADE_IN = 800;

	var inGame = false;
	
	goToSectionJSON('intro');

	//**Functions**\\
	function initGame(){
		setLife( CONST_LIFE_INIT );
	}

	function goToSectionJSON(myId){
		
		$.getJSON("myData.json",function(data){
			
			//**INITIALISATION**\\
			var items = [];
			var nbEach = 0;
			var myNbById = -1;
			var myActionName = 'null';

			//**RECUPERATION DES DONNEES**\\
			$.each(data.pages, function(key, val){

				if(myId == data.pages[nbEach].myId){myNbById = nbEach;}
				items[nbEach] = "<div class='section' id='" + data.pages[nbEach].myId + "'>" ;
				
				if(data.pages[nbEach].myContentH2 != "null"){
					items[nbEach] += "<h2>" + data.pages[nbEach].myContentH2 + "</h2>";}
				items[nbEach] += data.pages[nbEach].myContentTxt;
				
				if(data.pages[nbEach].myAction != "null"){
					items[nbEach] += "<action name='" + data.pages[nbEach].myAction + "'/>";
					if(myNbById==nbEach){myActionName=data.pages[nbEach].myAction;} }
				
				items[nbEach] += "<button go='" + data.pages[nbEach].myGo + "'>" + data.pages[nbEach].myGoContent + "</button>";
				items[nbEach] += "</div>";
					
				nbEach++;
			});
			
			//**AFFICHAGE DES DONNEES**\\
			if(myNbById!=-1){$('body').append(items[myNbById]);}
			/*EXECUTION DE L'ACTION COURANTE*/
			if(myActionName!='null'){executeAction(myActionName);}

			//**EVENEMENT**\\	
			$(".section button").click( function() {
				alert('front');
				$(this).parents('div').hide();
				goToSectionJSON($(this).attr('go'));
			} );

			//**VERIFICATION DE CONDITION DE FIN DE JEU**\\
			if(getLife()<=0 && inGame){endGame();}
		});

	}
	
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
} );