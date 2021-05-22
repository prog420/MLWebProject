import joblib
import re
import json
import Algorithmia
from CGRtools import smiles
from flask import Flask, render_template, url_for, request


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/predict', methods=['GET','POST'])
def predict():
    client = Algorithmia.client('simtds2YG9Ed/wd5xucmvHy+U8G1')
    algo = client.algo('Dmitry_BV/predictor/1.0.0')
    algo.set_options(timeout=100) # optional 
    smi = request.args.get('post')
    beamSize = request.args.get('beamSize')

    input_query = {"reaction": smi, 'beamWidth': beamSize}
    answers = algo.pipe(input_query).result["product"]
    reaction = smi + ">>" + answers
    img = get_svg(reaction)

    return json.dumps({'prediction': str(reaction), 'reaction': str(img)})


@app.route('/image', methods=['GET','POST'])
def image():
    post = request.args.get('post')
    img = get_svg(post)
    
    return json.dumps({'img': str(img)}); 

def get_svg(smi):
    """
    Return "..." if SMILES is not finished or contains errors
    Customization of bonds and fonts enabled
    """
    svg = smiles(smi)
    customize = True
    try:
        svg.clean2d()
        svg = svg.depict()
        if customize:
            svg = svg.replace('<g fill="#101010" font-family="sans-serif">', '<g fill="#101010" font-family="sans-serif">')
            svg = svg.replace('<g fill="none" stroke="black" stroke-width="0.04"', 
                            '<g fill="none" stroke="black" stroke-width="0.06"')
            svg = svg.replace('<g fill="#0305A7" font-size="0.25"', '<g fill="#0305A7" font-size="0.3"')
    except AttributeError:
        svg = "..."
    return svg

if __name__ == "__main__":
    app.run(debug=True)