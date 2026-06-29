from flask import Flask, Blueprint, abort, redirect, request, render_template
import google.auth
import google.auth.transport
import google.auth.transport.requests
import google.oauth2
import google.oauth2.id_token
from main import app, session
from google_auth_oauthlib.flow import Flow
from database import register
import os
import pathlib
import cachecontrol
import requests
import google



GOOGLE_CLIENT_ID = "1004505635733-p5goovgcu93egvbjb21m0jmrmufbrbmb.apps.googleusercontent.com" #This supposed to be secret

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, 'client_secret.json',)
flow = Flow.from_client_secrets_file(client_secrets_file=client_secrets_file,
                                     scopes=["https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/userinfo.email", "openid"],
                                     redirect_uri="http://127.0.0.1:5000/callback")

def login_required(function):
    def wrapper(*args, **kwargs):
        if 'google_id' not in session:
            abort(401)
        else:
            return function()
    return wrapper



@app.route('/Glogin')
def login():
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)

@app.route('/callback')
def callBack():
    flow.fetch_token(authorization_response=request.url)

    if not session['state'] == request.args['state']:
        abort(500)

    
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)
    credentials = flow.credentials
   
    id_info = google.oauth2.id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")
    session["picture"] = id_info.get("picture")
    session.permanent = True

    register(id_info.get("given_name"), id_info.get("family_name"), session["email"], None, None)
    return render_template('index.html', email=session["email"],name=session["name"], picture=session["picture"], logged=True)
