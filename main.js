// Variaveis de jogo

var canvas, estadoAtual, ctx, altura, largura, frames = 0, maxPulos = 3, velocidade = 6;

var estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
}

var chao = {
    y: 500,
    altura: 100,
    cor: "#ffd34d",

    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, largura, this.altura);
    }
};

function clicou(event){
    if(bloco.qntPulos === maxPulos){
        console.log("Não pula mais")
    }else {
        bloco.pula();
    }
    if(bloco.y === (chao.y - bloco.altura)){
        bloco.qntPulos = 0;
        bloco.pula();
    }
    if (estadoAtual == estados.jogar){
        estadoAtual = estados.jogando;
    }else if (estadoAtual == estados.perdeu){
        estadoAtual = estados.jogar;
    }
}


var bloco = {
    x: 50,
    y: 0,
    altura: 50,
    largura: 50,
    cor: "red",
    gravidade: 1.5,
    velocidade: 0,
    forcaDoPulo: 20,
    qntPulos:0,

    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    },

    atualiza: function(){
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if(this.y > chao.y - this.altura){
            this.y = chao.y - this.altura;
        }
    },

    pula: function(){
        this.velocidade = - this.forcaDoPulo;
        this.qntPulos++;
    }
}

var obstaculos = {
    _obs: [],
    cores: ["green", "black", "white", "blue", "pink"],
    tempoInsere: 0,
    
    insere: function (){
        this._obs.push({
            x: largura,
            largura: 30 + Math.floor(21 * Math.random()),
            altura: 30 + Math.floor(121 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())]
        });

        this.tempoInsere = 60;
    },

    atualiza: function (){
         if(this.tempoInsere == 0)
             this.insere();
        else
            this.tempoInsere--;
        

        for(var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];
            obs.x -= velocidade;

            if(bloco.x < obs.x + obs.largura &&
                bloco.x + bloco.largura >= obs.x &&
                bloco.y + bloco.altura >= chao.y - obs.altura){
                    estadoAtual = estados.perdeu
            }
            else if (obs.x <= obs.largura){
                this._obs.splice(i, 1);
                tam--;
                i--;
            }
        }
    },

    limpa: function(){
        this._obs = [];
    },

    desenha: function(){
        for(var i = 0; i < this._obs.length; i++){
            var obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura)
        }
    }
}

function main(){
    altura = window.innerHeight;
    largura = window.innerWidth;

    if (largura >= 500){
        largura = 600;
        altura = 600;
    }

    canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    canvas.style.border = "1px solid #000";

    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    document.addEventListener("mousedown", clicou);

    estadoAtual = estados.jogar;

    roda();
}

function roda(){
    atualiza();
    desenha();
    window.requestAnimationFrame(roda);
}

function atualiza(){
    frames++;
    
    bloco.atualiza();
    if (estadoAtual == estados.jogando){
        obstaculos.atualiza();
    }else if (estadoAtual == estados.perdeu)  {
        obstaculos.limpa();
    }
}

function desenha(){
    ctx.fillStyle = "#50beff"
    ctx.fillRect(0, 0, largura, altura);

    if (estadoAtual == estados.jogar){
        ctx.fillStyle = "green";
        ctx.fillRect(largura/2 -50, altura/2 -50, 100, 100)
    }else if ( estadoAtual == estados.perdeu){
        ctx.fillStyle = "red";
        ctx.fillRect(largura/2 -50, altura/2 -50, 100, 100)
    }else if (estadoAtual == estados.jogando){
        obstaculos.desenha();
    }

    chao.desenha();
    bloco.desenha();
}

//Inicia jogo
main();