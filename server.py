import psycopg2.errors
from flask import Flask
from flask import render_template, session, redirect, request, flash, url_for
import utils
import queries
from dotenv import load_dotenv

load_dotenv()
app = Flask('app')
app.secret_key = b'xxxx'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == "POST":
        username = request.form['username']
        plain_text_password = request.form['psw']
        hashed_password = utils.hash_password(plain_text_password)
        try:
            queries.register_user(username, hashed_password)

        except psycopg2.errors.UniqueViolation:
            flash('Username already exists, please choose another one!')
            return redirect(url_for('register'))
        flash('Succesfull Registration Now log in')
        return redirect(url_for('login'))
    return render_template('registration_form.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        plain_text_password = request.form['psw']
        password = queries.get_user_password(username)
        if password:
            if utils.verify_password(plain_text_password, password[0]['password']):
                session['username'] = username
            else:
                flash(f' No such username or password combination ')
            return redirect(url_for('index'))
        else:
            flash(f' No such username or password combination ')
            return redirect(url_for('login'))
    return render_template('login_form.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')
