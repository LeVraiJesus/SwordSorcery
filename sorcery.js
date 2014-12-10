$(function() {
	var CONST_LIFE_INIT = 4;
	var CONST_FADE_IN = 800;

	var inGame = false;
	var life = "--";
	var compagnon = null;
	var inventaire = Array();

	var hasReceivedParchemin = false;
	var hasReceivedKey = false;

	goToSectionJSON('acceuil');
/*	executeAction('getParchemin');
	executeAction('getClef');*/

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
			var myPage=null;
			//**RECUPERATION DES DONNEES**\\
			promise.done(function(data){
				$.each(data.pages,function(index, page){
					/*SELECTION DE LA PAGE SOUHAITEE*/
					if(myId == page.myId){
						/*EXECUTION DE L'ACTION COURANTE*/
						if(page.myAction != null){executeAction(page.myAction);}

						myPage = "<div class='section' id='" + page.myId + "'>" ;
					
						if(page.myContentH2 != null){
							myPage += "<h2>" + page.myContentH2 + "</h2>";}
					
						if(page.myContentTxt != null){
							myPage += "<p>" + page.myContentTxt + "</p>";}
						
						if(compagnon == 'Elf'){
							if(page.myContentElf != null){
								myPage += "<p class='contentCompagnon'>" + page.myContentElf + "</p>";}	
						}

						if(compagnon == 'Nain'){	
							if(page.myContentNain != null){
								myPage += "<p class='contentCompagnon'>" + page.myContentNain + "</p>";}
						}

						if(page.myAction != null){
							myPage += "<action name='" + page.myAction + "'/>";}
						
						$.each(page.myGo,function(index, idGo){
							myPage += "<button go='" + idGo+ "'>" + page.myGoContent[index] + "</button>";
						});
						
						myPage += "</div>";
					}
				});
				/*MISE EN FORME*/
				if(myId!="acceuil" && myId!="contact"){
					/*DIV STATUS*/	
					var divStatus = "<div id='status'><div id='premierNiveau'><div class='life'>";
					divStatus += "Life : <span class='value'>"+life+"</span></div>";
					divStatus += "<div id='inventaire'>Inventaire</div></div></div>";

					/*DIV INVENTAIRE*/
					if(inventaire.length>0)
					{
						var divInventaireContent = "<div id='secondNiveau'><div id='inventaireContent'>";
						for (var i=0; i<inventaire.length; i++){
							if(inventaire[i].indexOf("Parchemin")!=-1){
								divInventaireContent += "<span class='Parchemin'>"+inventaire[i]+"</span>";
							}else if(inventaire[i].indexOf("Clef")!=-1){
								divInventaireContent += "<span class='Clef'>"+inventaire[i]+"</span>";}
						};
						divInventaireContent += "</div></div>";
					}else{
						var divInventaireContent = "<div id='secondNiveau'><div id='inventaireContent'>";
						divInventaireContent += "<span id='empty'>Inventaire vide</span>";
						divInventaireContent += "</div></div>";
					}
				
				}
				//**AFFICHAGE DES DONNEES**\\
				if(myPage!=null){
					$('body').append(divStatus);
					$('#status').append(divInventaireContent);
					$('#inventaireContent').hide();	
					$('body').append(myPage);
					$('body > .section').hide();
					$('body > .section').fadeIn(CONST_FADE_IN);}
				
				//**EVENEMENT**\\	
				$('.section button').click( function() {
					goToSectionJSON($(this).attr('go'));
				});
				$('#inventaire').click(function(){
					$('#inventaireContent').slideDown(400);
					$('#inventaire').hover(function() {
					}, function() {
						$('#inventaireContent').hover(function() {
							$('#inventaireContent span').click(function(event) {
								console.log($(this).html());
							});
						}, function() {
							$('#inventaireContent').slideUp(300);
							
						});
					});
					//		$('#inventaireContent').slideDown(400);
				});
				//**VERIFICATION DE CONDITION DE FIN DE JEU**\\
				if(life<=0 && inGame){inGame = false;}
			});
	}
	
	function executeAction(name) { 
		switch(name)
		{
			case 'reset' :
				initGame();
				break;
			case 'start' :
				inGame = true;
				break;
			case 'hit' :
				if(inGame){
					life = life -1;
				}
				break;
			case 'getNain' :
				compagnon = 'Nain';
				break;
			case 'getElf' :
				compagnon = 'Elf';
				break;
			case 'resetCompagnon' :
				compagnon = null;
				break;
			case 'getParchemin' :
				if(!hasReceivedParchemin){
				inventaire.push("Parchemin de discrétion");
				hasReceivedParchemin = true;}
				break;
			case 'getClef' :
				if(!hasReceivedKey){
				inventaire.push("Clef rouillée");
				hasReceivedKey = true;}
				break;
		}
	}
});