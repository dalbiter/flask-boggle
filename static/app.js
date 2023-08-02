class BoggleGame {
    // create a new game at this DOM id

    constructor(boardId) {
        // new BoggleGame is called in <script> in the index.html to create new game. The board then becomes the section with id="boggle"
        this.board = $('#' + boardId);
        // to store validated words that have already been found and scored
        this.words = new Set();

        $(".new-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    // Show message based on word status. 
    showMessage(msg, cls) {
        $('msg', this.board).text(msg).removeClass().addClass(`msg ${cls}`)
    }

    // Handle submission of a word

    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $(".word", this.board);
    
        let word = $word.val();
        if (!word) return;
        if (this.words.has(word)) {
            this.showMessage(`Already found ${word}`)
        }

            //check server for validity
        const resp = await axios.get("/check-word", { params: {word: word }});
        console.log(resp);
        console.log('Hello')
    }

    
}

async function checkWord(word){
    const resp = await axios.get(`/check-word?word=${word}`);
    const result = resp.data.result
    console.log(resp)
    console.log(result)
}







