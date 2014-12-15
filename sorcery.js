$(function() {
	var CONST_LIFE_INIT = 4;
	var CONST_FADE_IN = 800;

	var promise = null;

	var inGame = false;
	var life = "--";
	var compagnon = null;
	var inventaire = Array();
	var outAction=null;
	
	var hasReceivedParchemin = false;
	var hasReceivedParcheminE = false;
	var hasReceivedKey = false;

	var isSnicky = false;
	var isWaterify = false;
	var haveKey = false;

	var rightDoorIsOpen1 = false;
	var rightDoorIsOpen2 = false;
	var leftDoorIsOpen = false;

	initMenu();
	//**Functions**\\
	function initMenu(){
		var myPage = null;
		myPage = "<div class='section' id='accueil'>";
		myPage += "<h2> Sword & Sorcery </h2>";
		myPage += "<button go='intro1'>La petite aventure</button>";
		myPage += "<button go='intro2'>La grande aventure</button>";
		myPage += "</div>";
		$('body').append(myPage);
		$('.section button').click(function(event) {
			if($(this).attr('go')=='intro1'){
				promise = initPromise('data1.json');
				goToSectionJSON('intro1');
			}else if($(this).attr('go')=='intro2'){
				promise = initPromise('data2.json');
				goToSectionJSON('intro2');
			}
		});
	}

	function initGame(){
		life = CONST_LIFE_INIT;
		
		inGame = false;
		compagnon = null;
		inventaire = Array();
		outAction=null;
	
		hasReceivedParchemin = false;
		hasReceivedParcheminE = false;
		hasReceivedKey = false;

		isSnicky = false;
		isWaterify = false;
		haveKey = false;

		rightDoorIsOpen1 = false;
		rightDoorIsOpen2 = false;
		leftDoorIsOpen = false;

	}

	function initPromise(jsonFic){
		var settings={
			dataType:"json",
			url:jsonFic}
		promise = $.ajax(settings);
		return promise;
	}

	function formatStatusBar(myId){
		if(myId!="acceuil"){
			/*DIV STATUS*/	
			var divStatus = "<div id='status'><div id='premierNiveau'><div class='life'>";
			divStatus += "Life : <span class='value'><strong>"+life+"</strong></span></div>";
			divStatus += "<div id='inventaire'>Inventaire : <span class='value'><strong>"+inventaire.length+"</strong> </span> V </div></div></div>";
			return divStatus;
		}
		return null;
	}

	function formatInventaireContentBar(myId){
		if(myId!="acceuil"){
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
			return divInventaireContent;
		}
		return null;
	}

	function goToSectionJSON(myId){
		//**INITIALISATION**\\
		$('body > div').remove();
		if(myId == 'accueil'){
			promise = null;
			initMenu();
		}else{
			var myPage=null;
			//**RECUPERATION DES DONNEES**\\
			promise.done(function(data){
				$.each(data.pages,function(index, page){
					/*SELECTION DE LA PAGE SOUHAITEE*/
					if(myId == page.myId){
						/*EXECUTION DE L'ACTION COURANTE*/
						outAction = null;
						if(page.myAction != null){outAction =executeAction(page.myAction);}

						myPage = "<div class='section' id='" + page.myId + "'>" ;
					
						if(page.myContentH2 != null){
							myPage += "<h2>" + page.myContentH2 + "</h2>";}
					
						if(page.myContentTxt != null){
							myPage += "<p>" + page.myContentTxt + "</p>";
						}
						
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
						
						if(page.myGo!=null){
							$.each(page.myGo,function(index, idGo){
								myPage += "<button go='" + idGo+ "'>" + page.myGoContent[index] + "</button>";
							});
						}

						myPage += "</div>";
					}
				});
				/*MISE EN FORME*/
				var divStatus=formatStatusBar(myId);
				var divInventaireContent=formatInventaireContentBar();

				//**AFFICHAGE DES DONNEES**\\
				if(myPage!=null){
					$('body').append(divStatus);
					$('#status').append(divInventaireContent);
					$('#inventaireContent').hide();	
					$('body').append(myPage);
					$('body > .section').hide();
					$('body > .section').fadeIn(CONST_FADE_IN);
				}
				//**GESTION OUT D'ACTION**\\
				if(outAction!=null){
					if(outAction.indexOf('</button>')==-1){
						$('body .section p').append(outAction);
					}else{
						$('body .section').append(outAction);
					}
				}

				//**EVENEMENT**\	
				$('.section button').click( function() {
					goToSectionJSON($(this).attr('go'));
				});
				$('#inventaire').click(function(){
					$('#inventaireContent').slideDown(400);
					$('#inventaire').hover(function() {
					}, function() {
						$('#inventaireContent').hover(function() {
							$('#inventaireContent span').click(function(event) {
								executeItemAction($(this).html(),myId);
							});
						}, function() {
							$('#inventaireContent').slideUp(300);
						});
					});
				});
				//**VERIFICATION DE CONDITION DE FIN DE JEU**\\
				if(life<=0 && inGame){inGame = false;setTimeout(goToSectionJSON, 1500,'death');}
			});
		}
	}
	
	function executeItemAction(name,id) {
		switch(name)
		{
			case "Parchemin de discrétion" :
				isSnicky = true;
				break;
			case "Clef rouillée" :
				haveKey = true;
				break;
			case "Parchemin force de l'eau" :
				isWaterify = true;
				break;
		}
		$.each(inventaire, function(index, item){
			if(item == name){
				inventaire.splice(index, 1);
				$('.section ').fadeOut(200);
				$('.section ').remove();
				$('body').append("<div class='section'>Utilisation/Equipement de <strong>"+item+"</strong></br>Utilisation unique, suppresison de l'objet dans l'inventaire ..</div>").fadeIn(300);
				setTimeout(goToSectionJSON, 2000,id);
			}
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
			case 'killTroll' :
				if(isSnicky){
					isScnicky = false;
					return 'Votre parchemin de discrétion a bien fonctionné vous avez pu égorger la bête sans encombre !';
				}else{
					life-=2;
					return 'Votre manque de discrétion à réveiller le troll une fois prés de lui vous perdez 2 points de vie dans le combat mais vous en sortais vainqueur';
				}
				break;
			case 'killTrollCompagnon' :
				if(compagnon == 'Nain'){
					life-=1;
				}
			case 'getClef' :
				if(!hasReceivedKey){
					inventaire.push("Clef rouillée");
					hasReceivedKey = true;}
				break;
			case 'openDoorLeft' :
				if(haveKey){
					return "<button go='porteGaucheWin'>continuer</button>";
				}else{
					return "<button go='porteGaucheFail'>continuer</button>";
				}
				break;
			case 'openDoorRight' :
				if(haveKey){
					haveKey = false;
					return "<button go='porteDroiteWin1'>continuer</button>";
				}else{
					return "<button go='porteDroiteFail'>continuer</button>";
				}
				break;
			case 'openDoorTryHard' :
				if(compagnon == 'Nain'){
					rightDoorIsOpen2 = true;
					return "<button go='porteDroiteWin2'>continuer</button>";
				}
				break;
			case 'getParcheminE' :
				if(!hasReceivedParcheminE){
					inventaire.push("Parchemin force de l'eau");
					hasReceivedParcheminE = true;}
				break;
			case 'rightDoorOpen1':
				rightDoorIsOpen1 = true;
				break;
			case 'leftDoorOpen':
				leftDoorIsOpen = true;
				break;
			case 'getPorte' :
				if(!rightDoorIsOpen2 && leftDoorIsOpen){
					return "<button go='derrierePorteGauche'>Entrer dans la piece de gauche</button> <button go='ouvrirPorteDroite'>Essayer d'ouvrir la porte de droite</button>";
				}else if(rightDoorIsOpen2 && !leftDoorIsOpen){
					return "<button go='derrierePorteDroite'>Entrer dans la piece de droite</button> <button go='ouvrirPorteGauche'>Essayer d'ouvrir la porte de gauche</button>";
				}else if(rightDoorIsOpen2 && leftDoorIsOpen){
					return "<button go='derrierePorteDroite'>Entrer dans la piece de droite</button><button go='derrierePorteGauche'>Entrer dans la piece de gauche</button>";}
				break;
			case 'finalBattle':
				if(isWaterify){
					life-=1;
					isWaterify=false;
					if(life>0)
						return "<button go='waterify'>continuer</button>";
					else
						return "<button go='death'>continuer</button>";
				}else{
					life-=3;
					isWaterify=false;
					if(life>0)
						return "<button go='notWaterify'>Récupérer le trésor de Zator</button>";
					else
						return "<button go='death'>continuer</button>";
				}
				break;
		}
	}
	return null;
});