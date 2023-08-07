from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

""" does this URL path map to a route function
    does this route return the right HTML
    does this route return the correct status code
    after a POST to this route, are we redirected
    after this route, does the session contain expected info"""


class FlaskTests(TestCase):

    def setUp(self):
        """setup for each test"""

        app.config['TESTING'] = True
    
    def test_home(self):
        """test home page, status, html, and info is in session"""
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)
        
            self.assertEqual(resp.status_code, 200)
            self.assertIn('<table class="board">', html)
            self.assertIn('<section id="boggle">', html)
            self.assertIn('board', session)

    def test_word(self):
        """ check if word is valid and on board"""
    
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [['F', 'R', 'O', 'G', 'T'],
                                           ['F', 'R', 'O', 'R', 'X'],
                                           ['F', 'R', 'A', 'G', 'X'],
                                           ['F', 'M', 'O', 'G', 'X'],
                                           ['S', 'R', 'O', 'G', 'X']]
            
            resp = client.get('/check-word?word=frog')
            self.assertEqual(resp.json['result'], 'ok')
            resp_2 = client.get('/check-word?word=smart')
            self.assertEqual(resp_2.json['result'], 'ok')

    def test_invalid_word(self):
        """Check if a word is in dictionary but not on board"""

        with app.test_client() as client:
            
            client.get('/')
            resp = client.get('/check-word?word=dictionary')

            self.assertEqual(resp.json['result'], 'not-on-board')

    def test_word_exists(self):
        """Check if a word is in dictionary but not on board"""

        with app.test_client() as client:
            
            client.get('/')
            resp = client.get('/check-word?word=lsadkfweijfhsldkgj')

            self.assertEqual(resp.json['result'], 'not-word')    

        
