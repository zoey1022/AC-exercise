// 定義遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', 'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', 'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', 'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png'
]
const view = {
// 顯示牌背圖樣
  getCardElement (index) {
    return `<div data-index="${index}" class="card back"></div>`
  },
// 點擊卡片才顯示花色跟數字
  getCardContent (index){
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>`
  },
  
// 將字母轉換成11-13
  transformNumber (number) {
    switch (number) {
      case 1: return 'A'
      case 11: return 'J'
      case 12: return 'Q'
      case 13: return 'K'
      default: return number
    }
  },
// 找出card內容，抽換內容
  displayCards(indexes){
    const rootElement = document.querySelector('#cards');
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('');
    // map 一個一個拿出來
    // join讓類陣列轉換成陣列
  },
  // 翻牌 flipCard(card)
  // flipCard(1,2,3,4) 可以接受很多參數，並把參數變成陣列
  // >>> cards = [1,2,3,4]
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        // 如果是背面
        // 回傳正面
        return
      }
      // 如果是正面
      // 回傳背面
      card.classList.add('back');
      card.innerHTML = null
    })
  },

  pairCards(...cards) {
    cards.map(card =>{
      card.classList.add('paired')
    })
  },

  renderScore(score) {
    document.querySelector(".score").textContent = `Score: ${score}`;
  },

  renderTriedTimes(times){
    document.querySelector(".tried").textContent = `You've tried: ${times} times`;
  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => 
        event.target.classList.remove('wrong'),{once:true})
    })
  },
showGameFinished (){
const div = document.createElement('div')
div.classList.add('completed')
div.innerHTML = `
<p>Complete!!!</P>
<p>Score: ${model.score}</p>
<p>You've tried: ${model.triedTimes} times</p>
`
const header = document.querySelector('#header')
header.before(div)
}

}


// 資料管理（目前翻出來的牌/暫存牌組）
const model = {
  revealedCards: [],

  isRevealedCardsMatched(){
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },
  // 分數及次數設定開始為0
  score: 0,
  triedTimes: 0

}

// 流程管理（管理view及model的動作)
const controller = {
  // 設定遊戲初始狀態
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
// 依照不同的遊戲狀態做不同的行為
  dispatchCardAction (card) {
    if(!card.classList.contains('back')){
      return
    }  
    switch (this.currentState){
      case GAME_STATE.FirstCardAwaits:
      view.flipCards(card)
      model.revealedCards.push(card)
      this.currentState = GAME_STATE.SecondCardAwaits
      break
      
      case GAME_STATE.SecondCardAwaits:
      view.renderTriedTimes(++model.triedTimes)
      view.flipCards(card)
      model.revealedCards.push(card)
      if (model.isRevealedCardsMatched()) {      
        // 配對正確
        view.renderScore(model.score += 10)
        this.currentState = GAME_STATE.CardsMatched
        view.pairCards(...model.revealedCards)
        // 須清空原本翻開的牌
        model.revealedCards = []
         if (model.score === 260){
           console.log('showGameFinished')
           this.currentState = GAME_STATE.GameFinished
           view.showGameFinished()
           return
         }
        // 回到初始狀態
        this.currentState = GAME_STATE.FirstCardAwaits
      } else {
        this.currentState = GAME_STATE.CardsMatchFailed
        view.appendWrongAnimation(...model.revealedCards)
        // 預留時間看牌
        setTimeout(this.resetCards, 1000)
        // 1000 = 1秒
      }
      break

    }
  console.log('current state:',this.currentState)
  console.log('revealed cards:',model.revealedCards.map(card => card.dataset.index))

  },
  resetCards (){
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}

// 洗牌
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

controller.generateCards()
//  view.displayCards() >>> (改由controller統一指派工作給大家)
// nodedlist (類矩陣)
 document.querySelectorAll('.card').forEach(card => {
   card.addEventListener('click', event => { 
     controller.dispatchCardAction(card)
   })

 })