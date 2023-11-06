class Grid{
    constructor(theme,grid)
    {
        this.cardsArr = [];
        this.theme = theme;
        this.n = grid;
    }

    createCardsGrid(){
        this.cardsArr=[];
        let range = Math.pow(this.n,2)
        let val;

        if(this.theme==="numbers")
            val=1;
        else
            val="A";

        for(let i=1;i<=range;i++)
        {
            this.cardsArr.push(val);
            if(i%2===0){
                if(this.theme === "numbers")
                    val++;
                else
                    val= String.fromCharCode(val.charCodeAt(0) + 1)
            }
        }

        this.cardsArr = sortCards(this.cardsArr);

        function sortCards(arr) {
            let arr2 = [];
            let range=arr.length;
            const arrLength = range;
        
            for(let i=0;i<arrLength;i++)
            {
                let position=Math.floor(Math.random()*range);
                arr2.push(arr[position]);
                const lHalfArr = arr.slice(0,position);
                const rHalfArr = arr.slice(position+1,range);
                arr = lHalfArr.concat(rHalfArr);
                range--;
            }
            return arr2;
        }
    }
}

class Menu{

    static menuEl = document.querySelector("#main__menu")
    static startBtn = document.querySelector("#start")

    constructor(theme,nbPlayers,n)
    {
        this.theme = theme;
        this.nbPlayers = nbPlayers;
        this.n = n;
    }

    setParameters()
    {
        let themeBtns = document.querySelectorAll("[name='theme_choice']");
        let gridBtns = document.querySelectorAll("[name='grid_choice']");

        themeBtns.forEach(btn=>{
            if(btn.checked === true)
                this.theme=btn.value
        });

        gridBtns.forEach(btn=>{
            if(btn.checked === true)
                this.n=btn.value
        });
    }

    selectButton(){
        const radioBtns = document.querySelectorAll("input[type='radio']");
        radioBtns.forEach((bouton)=>{
            bouton.addEventListener('click',()=>{   
                for(let btn of radioBtns)
                {
                    let button = btn.closest('.button')
                    if(btn.checked===true)
                        button.style.backgroundColor = "var(--DARK)";
                    else
                        button.style.backgroundColor = "var(--LIGHTGRAY)"
                }
            })
        })
    }
}

class Game{

    static gameDom  = `<section id="main__game">
                      <header id="header">
                      <h1 id="header__title">memory</h1>
                      <button class="header__button" id="new_game">New Game</button>
                      </header>
                      <div id="timer">
                        00:00
                      </div>
                      <div id="game">
                      </div>
                      </section>`                            
    
    static main=document.querySelector("main");
    static newGameBtn;
    static timer;
    static timerEl;
    static winScreen = document.querySelector("#winning_screen")
    static overlay = document.querySelector("#overlay")
    static score = document.querySelector("#score")
    static closebtn = document.querySelector("#close_button")

    constructor(theme,n){
        this.menu = new Menu(theme,n)
        this.grid = new Grid(theme,n);
        this.cardsDOM = [];
        this.min=0;
        this.sec=0;
        this.startTime=0;
        this.elapsedTime=0;
        this.gameFinished=false;
    }

    displayGame()
    {
        Menu.menuEl.remove();
        Game.main.innerHTML = Game.gameDom;
        Game.timerEl = document.querySelector("#timer");
        document.body.style.backgroundColor="var(--WHITE)"

        this.cardsDOM=[];
        this.grid.cardsArr.forEach((element,i) => {
            this.cardsDOM.push(`<div id="btn${i}" class="card" >${element}</div>`);
        })

        const gameEl = document.querySelector("#game")
        let timer=500;
        let delay;
        for(let i=0;i<this.cardsDOM.length;i++)
        {
            setTimeout(()=>{gameEl.innerHTML+=this.cardsDOM[i]
                                let card = document.getElementById(`btn${i}`);
                                if(this.grid.n==6)
                                {
                                    card.style.width="60px";
                                    card.style.height="60px";
                                    card.style.borderRadius="30px";
                                }
                                else
                                {
                                    card.style.fontSize="2em"
                                    card.style.width="100px";
                                    card.style.height="100px";
                                    card.style.borderRadius="50px";                           
                                }
                            },timer)
                            delay = setInterval(()=>{setTimeout(()=>{Game.timerEl.style.color="var(--DARK)"},0);setTimeout(()=>{Game.timerEl.style.color="var(--LIGHTGRAY)"},500)
                        },1000)
                            timer+=500;
        }
        setTimeout(()=>{
                            document.body.style.color="var(--DARK)";
                        Game.newGameBtn=document.querySelector("#new_game")},timer+500);
    }

    gameLogic(){
        let selectedCards=[]
        let styleSelectedCards=[]
        const cards = document.querySelectorAll(".card")
        cards.forEach((element)=>{
                element.addEventListener("click",()=>{
                selectedCards.push(element);
                element.style.color ="var(--WHITE)"

                if(selectedCards.length === 2)
                {
                    if(selectedCards[1].style.backgroundColor !== "var(--ORANGE)" && selectedCards[0].style.backgroundColor !== "var(--ORANGE)"){
                        if(selectedCards[1].textContent === selectedCards[0].textContent && selectedCards[1].id !== selectedCards[0].id){
                            selectedCards[1].style.color = "var(--WHITE)";
                            selectedCards[0].style.color = "var(--WHITE)";
                            selectedCards[1].style.backgroundColor = "var(--ORANGE)";
                            selectedCards[0].style.backgroundColor = "var(--ORANGE)";
                        }
                        else if(selectedCards[1].textContent !== selectedCards[0].textContent || selectedCards[1].id === selectedCards[0].id){
                            let styleSelectedCards=[];
                            styleSelectedCards.push(selectedCards[0]);
                            styleSelectedCards.push(selectedCards[1]);

                            setTimeout(()=>{styleSelectedCards[0].style.color = "var(--DARK)"},500)
                            setTimeout(()=>{styleSelectedCards[1].style.color = "var(--DARK)"},500)
                        }
                    }
                    else if(selectedCards[1].style.backgroundColor !== selectedCards[0].style.backgroundColor)
                    {
                        let styleSelectedCards=[];

                        if(selectedCards[0].style.backgroundColor === "var(--ORANGE)")
                            styleSelectedCards.push(selectedCards[1])
                        else
                            styleSelectedCards.push(selectedCards[0])

                        setTimeout(()=>{styleSelectedCards[0].style.color = "var(--DARK)"},500)
                    }
                    selectedCards.pop();
                    selectedCards.pop();
                }
                this.checkWin();
            });
        })




    }

    startGame(){
        this.gameFinished=false;
        this.grid.theme= this.menu.theme
        this.grid.n = this.menu.n
        this.grid.createCardsGrid();
        this.displayGame();
        setTimeout(()=>{
                        this.startTime=Date.now();
                        Game.timer = setInterval(()=>{this.updateTime()},1000);
                        this.gameLogic();
                        Game.newGameBtn.addEventListener('click',this.newGame)},500*this.grid.n*this.grid.n + 1000);
    }

    newGame(){
        Game.score.lastChild.remove();
        clearInterval(Game.timer);
        this.cardsDOM=[];
        const gameEl = document.querySelector("#main__game");
        document.body.style.backgroundColor="var(--DARK)";
        document.body.style.color="var(--WHITE)";
        gameEl.remove();
        Game.main.append(Menu.menuEl);
    }

    updateTime()
    {   
        this.elapsedTime = Date.now() - this.startTime;
        this.sec = Math.floor((this.elapsedTime/(1000)) %60)
        this.min = Math.floor((this.elapsedTime/(1000 *60)) %60)
        const timeZone=document.querySelector("#timer")

        timeZone.textContent = `${pad(this.min)}:${pad(this.sec)}`;
        function pad(unit)
        {            
            return (("0") + unit).length>2 ? unit : "0" + unit;
        }    
    }

    checkWin()
    {
        let win=true;
        const cards = document.querySelectorAll(".card")

        
        cards.forEach((card)=>{
            if(card.style.backgroundColor!="var(--ORANGE)")
                win=false;
        })

        if(win===true)
        {
            if(this.gameFinished===false){
                clearInterval(Game.timer);
                const time = document.createElement("h1");
                time.textContent= `${this.min}:${this.sec}`
                Game.score.append(time);
            }
            this.gameFinished=true;
            Game.winScreen.classList.add("active");
            Game.overlay.classList.add("active");
            Game.closebtn.addEventListener("click",()=>{Game.winScreen.classList.remove("active");Game.overlay.classList.remove("active");})
            Game.overlay.addEventListener("click",()=>{Game.winScreen.classList.remove("active");Game.overlay.classList.remove("active");})
        }

        
    }
}

const myGame = new Game("numbers",1,4);
myGame.menu.selectButton();

Menu.startBtn.addEventListener('click',()=>{
    myGame.menu.setParameters();
    myGame.startGame();
});