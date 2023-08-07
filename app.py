from flask import Flask, render_template, request, redirect, flash, session, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret-key"

boggle_game = Boggle()

@app.route('/')
def show_home():
    """Create and show boggle board"""

    #create the board
    board = boggle_game.make_board()
    # add board to session
    session['board'] = board

    return render_template('home.html', board=board)

@app.route('/check-word')
def check_word():
    """Check if a word is in the dictionary"""

    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route('/score-game', methods=["POST"])
def score_game():
    """get score, store number of times played, update high score"""

    score = request.json["score"]
    highscore = session.get('highscore', 0)
    nplays = session.get('nplays', 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(highscore, score)

    return jsonify(brokeRecord = score > highscore)
