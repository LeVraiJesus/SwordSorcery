$(function() {
	var CONST_LIFE_INIT = 4;
	var CONST_FADE_IN = 800;

	var inGame = false;
	var life = "--";

	goToSectionJSON('acceuil');

	//**Functions**\\
	function initGame(){
		life = CONST_LIFE_INIT;
	}

	function initPromise(){
		var settings={
			dataType:"json",
			url:"data.json"}
		promise = $.ajax(settings);
		return promise;
	}

	function goToSectionJSON(myId){
			//**INITIALISATION**\\
			$('body > div').remove();
			var promise=initPromise();
			var myActionName =null;
			var myPage=null;
			//**RECUPERATION DES DONNEES**\\
			promise.done(function(data){
				$.each(data.pages,function(index, page){
					if(myId == page.myId){
						myPage = "<div class='section' id='" + page.myId + "'>" ;
					
						if(page.myContentH2 != "null"){
							myPage += "<h2>" + page.myContentH2 + "</h2>";}
					
						if(page.myContentTxt != "null"){
							myPage += "<p>" + page.myContentTxt + "</p>";}
						
						if(page.myAction != "null"){
							myPage += "<action name='" + page.myAction + "'/>";
							myActionName=page.myAction;}
						
						$.each(page.myGo,function(index, idGo){
							myPage += "<button go='" + idGo+ "'>" + page.myGoContent[index] + "</button>";
						});
						
						myPage += "</div>";
					}
				});
				/*EXECUTION DE L'ACTION COURANTE*/
				if(myActionName!=null){executeAction(myActionName);}
				
				/*MISE EN FORME DIV STATUS*/
				if(myId!="acceuil" && myId!="contact"){
				var divStatus = "<div id='status'><div class='life'>";
				divStatus += "Life : <span class='value'>"+life+"</span>";
				divStatus += "</div></div>";}
				
				//**AFFICHAGE DES DONNEES**\\
				if(myPage!=null){
					$('body').append(divStatus);
					$('body').append(myPage);
					$('body > .section').hide();
					$('body > .section').fadeIn(CONST_FADE_IN);}
				
				//**EVENEMENT**\\	
				$(".section button").click( function() {
					goToSectionJSON($(this).attr('go'));
				});

				//**VERIFICATION DE CONDITION DE FIN DE JEU**\\
				if(life<=0 && inGame){endGame();}
			});
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
				if(inGame){
					console.log("hit");
					life = life -1;
					console.log(life);
				}
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
});