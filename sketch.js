var trex, trex_correndo, bordas, solo, soloInvisivel, imagemDaNuvem, obstaculo, pontuacao, grupoDeNuvens, grupoDeObstaculos, trex_colidiu, imagemDoSolo, obstaculo, obstaculo1,obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, imagemFimDoJogo, imagemReiniciar, somSalto, somMorte, somCheckPoint, fimDoJogo, reiniciar, nuvem, imagemDoFundo, fundo, imagemDoSol, sol;

var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo= JOGAR;

function preload(){
  
  //carregar a imagem de fundo
  imagemDoFundo = loadImage('fundocor.png');
  
  //criar animação do T-Rex correndo
  trex_correndo = loadAnimation('trex1cor.png','trex2cor.png','trex3cor.png');
  
  //criar animação do T-Rex
  trex_colidiu = loadAnimation("trex_colidiucor.png");
  
  //carregar imagem do solo
  imagemDoSolo = loadImage("solocor.png");
  
  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvemcor.png");
  
  // carregar imagens dos obstaculos
  obstaculo1 = loadImage("obstaculo1cor.png");
  obstaculo2 = loadImage("obstaculo2cor.png");
  obstaculo3 = loadImage("obstaculo3cor.png");
  obstaculo4 = loadImage("obstaculo4cor.png");
  
  //carregar imagens de final
  imagemFimDoJogo= loadImage("fimDoJogocor.png");
  imagemReiniciar= loadImage("reiniciarcor.png");
  
  //carregar sons
  somSalto = loadSound("pulo.mp3");
  somMorte = loadSound("morte.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  
  //carregar imagem do sol
  imagemDoSol = loadImage("solcor.png");
  
}

function setup(){
  
  //cria a tela
  createCanvas(windowWidth,windowHeight);
  
  //cria bordas
  bordas = createEdgeSprites();
  
  //aprendendo sobre console.log
  //escreve o nome do jogo no terminal
  console.log("T-Rex corredor");
  
  //cria solo
  solo = createSprite(width/2,height+50,width*2,20);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo);
  solo.scale = 1.1;
  
  //cria solo invisível
  soloInvisivel = createSprite(300,height,600,40);
  soloInvisivel.visible = false;
  
  //cria sprite do T-Rex
  trex = createSprite(50,height-90,20,50);
  trex.scale = 0.1;
  trex.x = 50;
  //adiciona a animação de T-Rex correndo ao sprite
  trex.addAnimation("correndo", trex_correndo);
  //adiciona a animação de T-rex colidindo ao sprite
  trex.addAnimation("colidiu" , trex_colidiu);
  
  //atribuir valor inicial à pontuação
  pontuacao = 0;
  
  //criar grupos de nuvens e obstáculos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  //adicionar e ajustar imagens do fim
  fimDoJogo = createSprite(width/2,height/2-20,400,20);
  fimDoJogo.addImage(imagemFimDoJogo);

  reiniciar = createSprite(width/2,height/2+20);
  reiniciar.addImage(imagemReiniciar);

  fimDoJogo.scale = 0.5;
  fimDoJogo.depth = fimDoJogo.depth+100;
  reiniciar.scale = 0.08;
  reiniciar.depth = reiniciar.depth+100;
  
  trex.setCollider("circle",0,0,310);
  trex.debug = false;
  
  //para Trex inteligente
  //trex.setCollider("rectangle",250,0);
  
  sol = createSprite(width-70,30,10,10);
  sol.addImage(imagemDoSol);
  sol.scale = 0.1;
  sol.depth = 1;

}

function draw(){

  //fundo branco
  background(imagemDoFundo);
  textSize(20);
  fill("black");
  text("Pontuação: "+ pontuacao,20,30);
  
  //desenha os sprites
  drawSprites();
  
  //Trex colide com o solo
  trex.collide(soloInvisivel);
   
  //estados de jogo
  if(estadoJogo === JOGAR){
    
    //faz o T-Rex correr adicionando velocidade ao solo
    solo.velocityX = -(4 + pontuacao/10);
    //faz o solo voltar ao centro se metade dele sair da tela
    if (solo.x<0){
      solo.x=width/2;
    }
    
    //som a cada 100 pontos
    if(pontuacao>0 && pontuacao%100 === 0){
      somCheckPoint.play();
    }
    
    //T-Rex pula ao apertar espaço
    if(keyDown('space') && trex.y > height-100 || touches > 0 && trex.y > height-100){
      trex.velocityY = -15; 
      somSalto.play();
      touches = [];
    }
    
    //gravidade
    trex.velocityY = trex.velocityY + 1;
    
    //gerar nuvens
    gerarNuvens();
    //gerar obstáculos
    gerarObstaculos();
    
    //pontuação continua rodando
    pontuacao = pontuacao + Math.round(frameRate()/60);
    

    //imagens do fim ficam invisíveis
    fimDoJogo.visible = false;
    reiniciar.visible = false;
    
    //quando o trex toca o obstáculo, o jogo se encerra
    if(grupoDeObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      //som de morte
      somMorte.play();
      
      //Trex inteligente
      //trex.velocityY= -12;
      //somSalto.play();
    }
  } else if(estadoJogo === ENCERRAR){
    //para os sprites em movimento
    trex.velocityY =0;
    solo.velocityX = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    //animação de T-Rex colidido
    trex.changeAnimation("colidiu" , trex_colidiu);
    
    //mostrar imagens do fim
    fimDoJogo.visible = true;
    reiniciar.visible = true;
    
    if(mousePressedOver(reiniciar) || touches > 0){
      reinicie();
      touches = [];
    }
    
  }
    console.log("estado de jogo: "+estadoJogo);
}

function gerarNuvens(){
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if(frameCount %100 === 0){
    nuvem = createSprite(width+30,100,40,10);
    nuvem.y = Math.round(random(30,height-120));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale =0.4;
    //ajustar profundidade da nuvem
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    //dar velocidade e direção à nuvem
    nuvem.velocityX=-3;
    //dar tempo de vida à nuvem
    nuvem.lifetime = width/nuvem.velocityX+20;
    //adicionar a um grupo
    grupoDeNuvens.add(nuvem);
  }
}

function gerarObstaculos(){
  //criar sprite de obstáculo a cada 60 quadros
  if(frameCount %60 === 0){
    obstaculo = createSprite(width+30,height-50,10,40);
    obstaculo.velocityX= -(6+ pontuacao/10);
  
    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1,4));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
        	break;
      case 2: obstaculo.addImage(obstaculo2);
        	break;
   	  case 3: obstaculo.addImage(obstaculo3);
        	break;
      case 4: obstaculo.addImage(obstaculo4);
        	break;
      default: break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width/obstaculo.velocityX + 10;
    //ajustar profundidade da nuvem
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth +1;
    //adicionar a um grupo
    grupoDeObstaculos.add(obstaculo);
  }
}

function reinicie(){
  estadoJogo = JOGAR;
  fimDoJogo.visible = false;
  reiniciar.visible = false;
  
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  
  trex.changeAnimation("correndo", trex_correndo);
  
  pontuacao = 0;
}
