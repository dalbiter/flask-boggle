class BoggleGame {
    // create a new game at this DOM id

    constructor(boardId, secs = 60) {
        this.secs = secs;
        this.showTimer();
       
        // new BoggleGame is called in <script> in the index.html to create new game. The board then becomes the section with id="boggle"
        this.board = $('#' + boardId);
        // to store validated words that have already been found and scored
        this.words = new Set();
        this.score = 0
        // adding timer
        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".new-word", this.board).on("submit", this.handleSubmit.bind(this));
    }


    // Show message based on word status. 
    showMessage(msg, cls) {
        $('.msg', this.board).text(msg).removeClass().addClass(`msg ${cls}`)
    }

    // show the current score
    showScore() {
        $('.score', this.board).text(this.score)
    }

    // show list of added words
    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
      }

    // Handle submission of a word

    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $(".word", this.board);
    
        let enteredWord = $word.val();
        // handle and letter case entered
        let word = enteredWord.toLowerCase()
        if (!word) {
            return;
        }
        // check for duplicate entries
        if (this.words.has(word)) {
            this.showMessage(`Already found ${word}`, 'err')
            return;
        }

            //check server for validity
        const resp = await axios.get("/check-word", { params: {word: word }});
        const result = resp.data.result
        if(result === 'not-word'){
            this.showMessage(`${word} is not a valid English word`, 'err');
        } else if(result === 'not-on-board'){
            this.showMessage(`${word} is not a valid word on this board`, 'err');
        } else {
            this.score += word.length;
            this.showScore(); 
            this.words.add(word);
            this.showMessage(`Added: ${word}`, 'ok');
            this.showWord(word);
        }
    }

    showTimer() {
        $('.timer', this.board).text(this.secs)
    }

    async tick() {
        this.secs -= 1;
        this.showTimer();

        if(this.secs === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    } 

    async scoreGame() {
        $('.new-word', this.board).hide();
        const resp = await axios.post('/score-game', { score: this.score });
        console.log(resp.data.brokeRecord) 
        if(resp.data.brokeRecord){
            this.showMessage(`New Record: ${this.score}`, 'ok')
        } else {
            this.showMessage(`Final Score: ${this.score}`, 'ok')
        }   
    }

    
}








